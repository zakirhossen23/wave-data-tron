// ignore_for_file: prefer_const_literals_to_create_immutables

import 'dart:convert';
import 'dart:io';
import 'dart:js';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:jiffy/jiffy.dart';
import 'package:percent_indicator/circular_percent_indicator.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:wavedata/components/bottom_navbar.dart';
import 'package:wavedata/model/offer.dart';
import 'package:wavedata/model/trial.dart';
import 'package:wavedata/model/trial_action.dart';
import 'package:wavedata/providers/navbar_provider.dart';
import 'package:wavedata/screens/auth_screen.dart';
import 'package:wavedata/screens/feeling_screen.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';

import 'questionnaire_screen.dart';

class MainScreen extends ConsumerStatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<ConsumerStatefulWidget> createState() => _MainScreenState();
}

class _MainScreenState extends ConsumerState<MainScreen> {
  @override
  initState() {
    super.initState();
    GetAccountData();
  }

  var TGheader = {
    "accept-language": "en-US,en;q=0.9",
    "Authorization": "Bearer n63cf58df61rvnp6dgeq4a4rolokeoe8",
  };

  var FHIRheader = {
    "accept": "application/fhir+json",
    "x-api-key": "FoWtFhNkC92Zi7Xnt9fkvazavyNbMkGv4pYwoQRO"
  };
  var supportStatus = {"level1": false, "level2": false};

  int userid = 0;
  int startTrial = 0;
  String ImageLink = "https://i.postimg.cc/SsxGw5cZ/person.jpg";
  var userDetails = {
    "userid": -1,
    "credits": 0,
    "ongoingcredit": null,
    "totalongoingcredit": null
  };

  Future<void> GetAvialbleData() async {
    avilableTrials = [];
    var url = Uri.parse(
        'https://cors-anyhere.herokuapp.com/https://test.i.tgcloud.io:14240/restpp/query/WaveData/SelectTrialUserID?userIDTXT=${userid}');
    final response = await http.get(url, headers: TGheader);
    var responseData = json.decode(response.body);
    var data = (responseData['results']);
    var allTrials = data[0]['TR'];
    allTrials.forEach((element) => {
          setState(() {
            avilableTrials.add(Trial(
              id: element['attributes']['id'],
              image: element['attributes']['image'],
              title: element['attributes']['title'],
            ));
          })
        });
  }

  Future<void> GetOngoingData() async {
    ongoingTrials = {
      "trialid": -1,
      "title": "",
      "description": "",
      "image": "",
      "startSurvey": 0,
      "totalprice": 0
    };
    dummyActions = [];
    var url = Uri.parse(
        'https://cors-anyhere.herokuapp.com/https://test.i.tgcloud.io:14240/restpp/query/WaveData/GetOngoingTrial?userIDTXT=${userid}');
    final response = await http.get(url, headers: TGheader);
    var responseData = json.decode(response.body);
    var data = (responseData['results']);

    int onGoingSurveyId = data[1]['TOTAL'];

    if (onGoingSurveyId > 0) {
      setState(() {
        isOngoingTrial = true;
      });
      try {
        //Courses
        var element = data[0]['TR'][0];
        setState(() {
          ongoingTrials['trialid'] = element['attributes']['id'];
          ongoingTrials['title'] = element['attributes']['title'];
          ongoingTrials['description'] = element['attributes']['description'];
          ongoingTrials['image'] = element['attributes']['image'];
          ongoingTrials['totalprice'] = element['attributes']['budget'];
          userDetails['totalongoingcredit'] = element['attributes']['budget'];
        });
      } catch (e) {}
    }

    setState(() {
      //Surveys
      var SurveyAllElement = data[2]['SRV'];
      var SurveyAllCompletedElement = data[3]['Completed'];
      int totalcredit = 0;
      for (var i = 0; i < SurveyAllElement.length; i++) {
        var SurveyElement = SurveyAllElement[i];
        var completedSurvey = SurveyAllCompletedElement.where((e) =>
            e['attributes']['surveyid'] == SurveyElement['attributes']['id']);
        String timeToday = "Today";
        if (completedSurvey.length > 0) {
          var completedData = completedSurvey.toList()[0]['attributes'];
          String completedDate = completedData['date'];
          String timeToday =
              Jiffy(DateTime.parse(completedDate)).fromNow(); // a year ago
          supportStatus['level1'] = true;
        }
        bool status = completedSurvey.length > 0;
        totalcredit +=
            int.parse(SurveyElement['attributes']['reward'].toString());

        dummyActions.add(
          TrialAction(
              id: SurveyElement['attributes']['id'],
              when: timeToday,
              content: SurveyElement['attributes']['name'],
              isDone: status),
        );
      }
      userDetails['ongoingcredit'] = totalcredit;
    });
  }

  Future<void> GetFHIRData(int userid) async {
    var urlTG = Uri.parse(
        'https://cors-anyhere.herokuapp.com/https://test.i.tgcloud.io:14240/restpp/query/WaveData/GetFHIRByUserID?useridTXT=${int.parse(userid.toString())}');
    final response = await http.get(urlTG, headers: TGheader);
    var responseDataTG = json.decode(response.body);
    if (responseDataTG['results'] != null) {
      var data = (responseDataTG['results']);
      var imageData = data[2]['IMG'][0]['attributes']['image'];

      setState(() {
        ImageLink = imageData;
        userDetails["credits"] = data[2]['IMG'][0]['attributes']['credits'];
      });
      try {
        var allData = data[0]['SV'][0]['attributes'];

        var patientid = int.parse(allData['FHIRID'].toString());

        var url = Uri.parse(
            "https://fhir.9sb2xtg1lmi6.static-test-account.isccloud.io/Patient/${patientid}");
        final response = await http.get(url, headers: FHIRheader);
        var responseData = json.decode(response.body);
        try {
          setState(() {
            PatientDetails['gender'] = responseData['gender'];
            PatientDetails['name-family'] = responseData['name'][0]['family'];
            PatientDetails['name-given'] = responseData['name'][0]['given'][0];
            var phone = responseData['telecom'][0];
            PatientDetails['phone'] = phone["value"].toString();
          });
        } catch (e) {}

        var urlDiagnostic = Uri.parse(
            "https://fhir.9sb2xtg1lmi6.static-test-account.isccloud.io/DiagnosticReport?patient=${patientid}");
        final responseDiagnostic =
            await http.get(urlDiagnostic, headers: FHIRheader);
        var responseDataDiagnostic = json.decode(responseDiagnostic.body);
        try {
          var allDiagnostic = responseDataDiagnostic['entry'];
          var DiseasesDiagnostic = allDiagnostic[allDiagnostic.length - 1]
              ['resource']['presentedForm'][0]['data'];

          String decodedDisease =
              utf8.decode(base64.decode(DiseasesDiagnostic));
          setState(() {
            PatientDetails['disease'] = decodedDisease;
          });
        } catch (e) {}
      } catch (e) {}
    }
  }

  Future<void> GetAccountData() async {
    // Obtain shared preferences.
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      userid = int.parse(prefs.getString("userid").toString());
    });

    GetAvialbleData();
    GetOngoingData();
    GetFHIRData(userid);
  }

  var dummyActions = [];
  var ongoingTrials = {
    "trialid": -1,
    "title": "",
    "description": "",
    "image": "",
    "startSurvey": 0
  };
  bool isOngoingTrial = false;

  var PatientDetails = {
    "gender": "male",
    "name-family": "",
    "name-given": "",
    "phone": "",
    "disease": ""
  };

  var avilableTrials = [];

  var dummyOffers = [
    Offer(
        title: "30% cashback",
        store: "Amazon",
        period: "May 1 - May 28",
        image: "assets/images/amazon.png"),
    Offer(
        title: "10% off - Fitbit Sense",
        store: "Fitbit",
        period: "May 1 - May 28",
        image: "assets/images/fitbit.png"),
    Offer(
        title: "40% off (6 months)",
        store: "Calm",
        period: "May 1 - May 28",
        image: "assets/images/calm.png"),
    Offer(
        title: "10% off monthly",
        store: "Spotify",
        period: "May 1 - May 28",
        image: "assets/images/spotify.png"),
  ];

  @override
  Widget build(BuildContext context) {
    var size = MediaQuery.of(context).size;
    var navbarViewmodel = ref.watch(navbarProvider);
    Future<void> Logout() async {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove("userid");
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => AuthScreen(),
        ),
      );
    }

    double percentagecompleted() {
      int total = int.parse(userDetails['totalongoingcredit'].toString());
      int price = int.parse(userDetails['ongoingcredit'].toString());

      var t = (1 / (total / price));
      print(t);
      return t.toDouble();
    }

    Future<void> StartTrial(int trialid) async {
      final prefs = await SharedPreferences.getInstance();
      int userid = int.parse(prefs.getString("userid").toString());
      var url = Uri.parse(
          'https://cors-anyhere.herokuapp.com/https://test.i.tgcloud.io:14240/restpp/query/WaveData/CreateOngoingTrial?trialidTXT=${trialid}&userIDTXT=${userid}');
      final response =
          await http.get(url, headers: _MainScreenState().TGheader);
      var responseData = json.decode(response.body);

      Navigator.pop(context);
    }

    Future startFunction(int trialid) => showDialog(
        context: context,
        builder: (context) => AlertDialog(
              title: Text("Do you want to start the course?"),
              actions: [
                TextButton(
                    onPressed: (() async {
                      await StartTrial(trialid);
                    }),
                    child: Text("Accept"))
              ],
            ));

    TextEditingController _textFieldController = TextEditingController();
    void UpdateImage() async {
      setState(() {
        ImageLink = _textFieldController.text;
      });
      final prefs = await SharedPreferences.getInstance();
      int userid = int.parse(prefs.getString("userid").toString());

      var url = Uri.parse(
          'https://cors-anyhere.herokuapp.com/https://test.i.tgcloud.io:14240/restpp/query/WaveData/UpdateImage?useridTXT=${userid}&imageTXT=${_textFieldController.text}');
      final response = await http.get(url, headers: TGheader);
      var responseData = json.decode(response.body);

      Navigator.of(context).pop();
    }

    imagePickerOption(BuildContext context) async {
      return showDialog(
          context: context,
          builder: (context) {
            return AlertDialog(
              title: Text('Image url'),
              content: TextField(
                controller: _textFieldController,
                decoration:
                    const InputDecoration(hintText: "https://image.com/we.png"),
              ),
              actions: <Widget>[
                TextButton(
                  child: const Text('SUBMIT'),
                  onPressed: UpdateImage,
                )
              ],
            );
          });
    }

    return Scaffold(
      bottomNavigationBar: WavedataNavbar(),
      body: IndexedStack(
        index: navbarViewmodel.selectedIndex,
        children: [
          //home
          Container(
            height: size.height,
            width: size.width,
            decoration: BoxDecoration(
              image: DecorationImage(
                fit: BoxFit.cover,
                image: Image.asset("assets/images/bg.png").image,
              ),
            ),
            child: SingleChildScrollView(
              child: SafeArea(
                child: Column(
                  children: [
                    Container(
                      margin: EdgeInsets.only(top: 24, left: 16, right: 16),
                      child: Material(
                        elevation: 5,
                        borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(128),
                            bottomLeft: Radius.circular(128),
                            topRight: Radius.circular(12),
                            bottomRight: Radius.circular(12)),
                        child: Container(
                          height: 150,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Material(
                                  elevation: 8,
                                  color: Colors.amber,
                                  borderRadius: BorderRadius.circular(128),
                                  clipBehavior: Clip.none,
                                  child: Container(
                                      height: 148,
                                      width: 148,
                                      padding: EdgeInsets.all(12),
                                      clipBehavior: Clip.antiAlias,
                                      decoration: BoxDecoration(
                                          borderRadius:
                                              BorderRadius.circular(200.0),
                                          color: Colors.white),
                                      child: Stack(
                                        children: [
                                          Container(
                                            child: Image.network(
                                              ImageLink,
                                              fit: BoxFit.fitWidth,
                                            ),
                                          ),
                                          Positioned(
                                            bottom: 5,
                                            right: 5,
                                            child: GestureDetector(
                                                onTap: () {
                                                  var viewmodel =
                                                      ref.watch(navbarProvider);
                                                  viewmodel.updateIndex(2);
                                                },
                                                child: Container(
                                                  height: 40,
                                                  width: 40,
                                                  decoration: BoxDecoration(
                                                    shape: BoxShape.circle,
                                                    border: Border.all(
                                                      width: 4,
                                                      color: Color(0xFFF06129),
                                                    ),
                                                    color: Colors.white,
                                                  ),
                                                  child: const Icon(
                                                    Icons.edit,
                                                    color: Color(0xFFF06129),
                                                  ),
                                                )),
                                          )
                                        ],
                                      ))),
                              Container(
                                margin: EdgeInsets.only(right: 20),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    AspectRatio(
                                      aspectRatio: 2 / 4,
                                      child: Container(
                                          margin: EdgeInsets.only(
                                              top: 20, bottom: 20),
                                          padding: EdgeInsets.only(bottom: 24),
                                          decoration: BoxDecoration(
                                              borderRadius:
                                                  BorderRadius.circular(12),
                                              border: Border.all(
                                                  color: Colors.grey
                                                      .withOpacity(0.3),
                                                  width: 1.5),
                                              color: Color(0xFFD1D5DB)),
                                          child: Image.asset(
                                              "assets/images/ribbon.png")),
                                    ),
                                    SizedBox(
                                      width: 16,
                                    ),
                                    AspectRatio(
                                      aspectRatio: 2 / 4,
                                      child: Container(
                                          margin: EdgeInsets.only(
                                              top: 20, bottom: 20),
                                          padding: EdgeInsets.only(bottom: 24),
                                          decoration: BoxDecoration(
                                              borderRadius:
                                                  BorderRadius.circular(12),
                                              border: Border.all(
                                                  color: Colors.grey
                                                      .withOpacity(0.3),
                                                  width: 1.5),
                                              color: Color(0xFFD1D5DB)),
                                          child: Image.asset(
                                              "assets/images/gift.png")),
                                    ),
                                  ],
                                ),
                              )
                            ],
                          ),
                        ),
                      ),
                    ),
                    Container(
                        margin: EdgeInsets.only(top: 12, left: 16, bottom: 4),
                        child: Row(
                          children: [
                            const Text(
                              "Ongoing Courses",
                              style: TextStyle(
                                  color: Color(0xFF08323A),
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600),
                            ),
                          ],
                        )),
                    Container(
                      margin: EdgeInsets.only(left: 16, right: 16),
                      child: Material(
                        borderRadius: BorderRadius.circular(12),
                        child: Stack(children: [
                          RefreshIndicator(
                              onRefresh: GetOngoingData,
                              child: Stack(children: [
                                Container(
                                  height: 240,
                                  width: size.width,
                                  child: isOngoingTrial == true
                                      ? ClipRRect(
                                          child: RefreshIndicator(
                                            onRefresh: GetOngoingData,
                                            child: Wrap(
                                              children: [
                                                Container(
                                                  margin: const EdgeInsets.only(
                                                      left: 16,
                                                      top: 8,
                                                      bottom: 8),
                                                  child: Text(
                                                    ongoingTrials['title']
                                                        .toString(),
                                                    style: const TextStyle(
                                                        color:
                                                            Color(0xFFF06129),
                                                        fontWeight:
                                                            FontWeight.bold),
                                                  ),
                                                ),
                                                Image.network(
                                                    ongoingTrials['image']
                                                        .toString(),
                                                    width: size.width,
                                                    fit: BoxFit.cover)
                                              ],
                                            ),
                                          ),
                                        )
                                      : const Center(
                                          child: Text("No ongoing Courses")),
                                ),
                                Positioned(
                                    bottom: 5,
                                    child: isOngoingTrial == true
                                        ? Container(
                                            width: size.width,
                                            height: 150,
                                            child: ListView.builder(
                                              itemCount: dummyActions.length,
                                              padding: EdgeInsets.only(left: 8),
                                              scrollDirection: Axis.horizontal,
                                              itemBuilder: ((context, index) =>
                                                  ActionTile(
                                                    action: dummyActions[index],
                                                    startFunction: () async {
                                                      await Navigator.push(
                                                        context,
                                                        MaterialPageRoute(
                                                          builder: (context) =>
                                                              QuestionnaireScreen(),
                                                        ),
                                                      );
                                                      GetAccountData();
                                                    },
                                                  )),
                                            ),
                                          )
                                        : Text(""))
                              ])),
                        ]),
                      ),
                    ),
                    Container(
                        margin: EdgeInsets.only(top: 25, left: 16, bottom: 4),
                        child: Row(
                          children: [
                            const Text(
                              "Available Courses",
                              style: TextStyle(
                                  color: Color(0xFF08323A),
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600),
                            ),
                          ],
                        )),
                    Container(
                      width: size.width,
                      height: 200,
                      child: ListView.builder(
                        itemCount: avilableTrials.length,
                        padding: EdgeInsets.only(left: 16),
                        scrollDirection: Axis.horizontal,
                        itemBuilder: ((context, index) {
                          var trial = avilableTrials[index];
                          return Container(
                            //padding: EdgeInsets.all(14),
                            margin: EdgeInsets.only(right: 12),
                            decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(12),
                                border:
                                    Border.all(color: Colors.white, width: 1),
                                color: Colors.white),
                            width: 200,
                            clipBehavior: Clip.hardEdge,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                GestureDetector(
                                  onTap: (() async {
                                    await startFunction(trial.id);
                                    GetAccountData();
                                  }),
                                  behavior: HitTestBehavior.opaque,
                                  child: Container(
                                    child: Column(
                                      children: [
                                        ClipRRect(
                                          borderRadius: const BorderRadius.only(
                                              topLeft: Radius.circular(12),
                                              topRight: Radius.circular(12)),
                                          child: Container(
                                            height: 140,
                                            child: Image.network(
                                              trial.image,
                                              width: 250,
                                              fit: BoxFit.fitWidth,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          alignment: Alignment.bottomLeft,
                                          padding: EdgeInsets.only(
                                              left: 10, top: 10),
                                          child: Text(
                                            trial.title,
                                            style: const TextStyle(
                                                color: Color(0xFFF06129),
                                                fontSize: 16,
                                                fontWeight: FontWeight.w400),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                )
                              ],
                            ),
                          );
                        }),
                      ),
                    )
                  ],
                ),
              ),
            ),
          ),
          //support
          Container(
            height: size.height,
            width: size.width,
            decoration: BoxDecoration(
              image: DecorationImage(
                fit: BoxFit.cover,
                image: Image.asset("assets/images/map.png").image,
              ),
            ),
            child: Stack(children: [
              Positioned(
                bottom: 85,
                left: 170,
                child: Container(
                  height: 100,
                  width: 100,
                  //padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(128),
                  ),
                  child: supportStatus["level1"] == true
                      ? Image.asset(
                          "assets/images/support/level1completed.png",
                        )
                      : Image.asset(
                          "assets/images/support/level1Incomplete.png",
                        ),
                ),
              ),
              Positioned(
                bottom: 260,
                left: 52,
                child: Container(
                    height: 100,
                    width: 100,
                    //padding: EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(128),
                    ),
                    /* child: Image.asset(
                      "assets/images/gift_big.png",
                    ), */
                    child: Image.asset(
                      "assets/images/support/level2Incomplete.png",
                      colorBlendMode: BlendMode.dstOut,
                    )),
              ),
              Positioned(
                bottom: 382,
                right: 30,
                child: Container(
                  height: 100,
                  width: 100,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(128),
                    color: Color(0xFFe7dcdc),
                  ),
                  child: CircularPercentIndicator(
                    radius: 50.0,
                    lineWidth: 8.0,
                    percent: 0,
                    center: Container(
                      width: 60,
                      padding: EdgeInsets.only(top: 6),
                      child: Image.asset(
                        "assets/images/chocolates.png",
                        color: Colors.grey.withOpacity(0.5),
                        colorBlendMode: BlendMode.dstOut,
                      ),
                    ),
                    circularStrokeCap: CircularStrokeCap.round,
                    progressColor: Color(0xFFf06129),
                    backgroundColor: Color(0xFFa6c5ce),
                  ),
                ),
              ),
              Positioned(
                top: 145,
                right: 85,
                child: Container(
                  height: 100,
                  width: 100,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(128),
                    color: Color(0xFFe7dcdc),
                  ),
                  child: CircularPercentIndicator(
                    radius: 50.0,
                    lineWidth: 8.0,
                    percent: 0,
                    center: Container(
                      width: 60,
                      child: Image.asset(
                        "assets/images/crown.png",
                        color: Colors.grey.withOpacity(0.5),
                        colorBlendMode: BlendMode.dstOut,
                      ),
                    ),
                    circularStrokeCap: CircularStrokeCap.round,
                    progressColor: Color(0xFFf06129),
                    backgroundColor: Color(0xFFa6c5ce),
                  ),
                ),
              ),
              Positioned(
                top: 10,
                left: 100,
                child: Stack(
                  children: [
                    Positioned(
                      bottom: 0,
                      left: 5,
                      child: Container(
                        height: 28,
                        width: 90,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: Colors.white),
                          color: Color(0xFFF06129),
                        ),
                        child: Container(
                          child: Center(
                            child: Text(
                              "Finish",
                              style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ),
                    ),
                    Container(
                      height: 100,
                      width: 100,
                      margin: EdgeInsets.only(bottom: 25),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(128),
                        color: Color(0xFFe7dcdc),
                      ),
                      child: CircularPercentIndicator(
                        radius: 50.0,
                        lineWidth: 8.0,
                        percent: 0,
                        center: Container(
                          width: 56,
                          child: Image.asset(
                            "assets/images/winner.png",
                            color: Colors.grey.withOpacity(0.5),
                            colorBlendMode: BlendMode.dstOut,
                          ),
                        ),
                        circularStrokeCap: CircularStrokeCap.round,
                        progressColor: Color(0xFFf06129),
                        backgroundColor: Color(0xFFa6c5ce),
                      ),
                    ),
                  ],
                ),
              )
            ]),
          ),

//******************************** */
          //My Data
          Container(
            height: size.height,
            width: size.width,
            decoration: BoxDecoration(
              image: DecorationImage(
                fit: BoxFit.cover,
                image: Image.asset("assets/images/bg.png").image,
              ),
            ),
            child: Stack(children: [
              Container(
                  margin: EdgeInsets.only(left: 10, top: 26, bottom: 50),
                  height: 100,
                  child: Text(
                    "My data",
                    style: TextStyle(fontSize: 30),
                  )),
              Positioned(
                top: 25,
                right: 30,
                child: GestureDetector(
                    onTap: () async {
                      await Logout();
                    },
                    child: Container(
                      height: 40,
                      width: 40,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          width: 4,
                          color: Color.fromARGB(255, 255, 0, 0),
                        ),
                        color: Colors.white,
                      ),
                      child: const Icon(
                        Icons.logout,
                        color: Color.fromARGB(255, 255, 0, 0),
                      ),
                    )),
              ),
              Container(
                width: 150,
                height: 150,
                margin: EdgeInsets.only(top: 70, left: 120),
                padding: EdgeInsets.all(12),
                clipBehavior: Clip.antiAlias,
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(200.0),
                    color: Colors.white),
                child: Stack(
                  children: [
                    Container(
                      child: Wrap(
                        children: [
                          Image.network(ImageLink,
                              width: size.width, fit: BoxFit.fill)
                        ],
                      ),
                    ),
                    Positioned(
                      bottom: 5,
                      right: 5,
                      child: GestureDetector(
                          onTap: () {
                            imagePickerOption(context);
                          },
                          child: Container(
                            height: 40,
                            width: 40,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                width: 4,
                                color: Color(0xFFF06129),
                              ),
                              color: Colors.white,
                            ),
                            child: const Icon(
                              Icons.edit,
                              color: Color(0xFFF06129),
                            ),
                          )),
                    )
                  ],
                ),
              ),
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(24, 220, 24, 0),
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      Padding(
                        padding: EdgeInsetsDirectional.fromSTEB(0, 5, 0, 0),
                        child: Container(
                          width: MediaQuery.of(context).size.width * 0.90,
                          decoration: BoxDecoration(
                            color: Color.fromARGB(255, 238, 238, 238),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(2, 2, 2, 2),
                            child: Column(
                              children: [
                                Row(
                                  children: [
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          5, 5, 5, 5),
                                      child: Text(
                                        'Family name',
                                        style: GoogleFonts.getFont(
                                          'Lexend',
                                          color: Colors.black,
                                          fontWeight: FontWeight.w500,
                                          fontSize: 18,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                Row(
                                  children: [
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          5, 5, 5, 5),
                                      child: Text(
                                        PatientDetails['name-family']
                                            .toString(),
                                        style: GoogleFonts.getFont(
                                          'Lexend Deca',
                                          fontSize: 14,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      Padding(
                        padding: EdgeInsetsDirectional.fromSTEB(0, 5, 0, 0),
                        child: Container(
                          width: MediaQuery.of(context).size.width * 0.90,
                          decoration: BoxDecoration(
                            color: Color.fromARGB(255, 238, 238, 238),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(2, 2, 2, 2),
                            child: Column(
                              children: [
                                Row(
                                  children: [
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          5, 5, 5, 5),
                                      child: Text(
                                        'Given name',
                                        style: GoogleFonts.getFont(
                                          'Lexend',
                                          color: Colors.black,
                                          fontWeight: FontWeight.w500,
                                          fontSize: 18,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                Row(
                                  children: [
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          5, 5, 5, 5),
                                      child: Text(
                                        PatientDetails['name-given'].toString(),
                                        style: GoogleFonts.getFont(
                                          'Lexend Deca',
                                          fontSize: 14,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      Padding(
                        padding: EdgeInsetsDirectional.fromSTEB(0, 5, 0, 0),
                        child: Container(
                          width: MediaQuery.of(context).size.width * 0.90,
                          decoration: BoxDecoration(
                            color: Color.fromARGB(255, 238, 238, 238),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(2, 2, 2, 2),
                            child: Column(
                              children: [
                                Row(
                                  children: [
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          5, 5, 5, 5),
                                      child: Text(
                                        'Gender',
                                        style: GoogleFonts.getFont(
                                          'Lexend',
                                          color: Colors.black,
                                          fontWeight: FontWeight.w500,
                                          fontSize: 18,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                Row(
                                  children: [
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          5, 5, 5, 5),
                                      child: Text(
                                        PatientDetails['gender'].toString(),
                                        style: GoogleFonts.getFont(
                                          'Lexend Deca',
                                          fontSize: 14,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      Padding(
                        padding: EdgeInsetsDirectional.fromSTEB(0, 5, 0, 0),
                        child: Container(
                          width: MediaQuery.of(context).size.width * 0.90,
                          decoration: BoxDecoration(
                            color: Color.fromARGB(255, 238, 238, 238),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(2, 2, 2, 2),
                            child: Column(
                              children: [
                                Row(
                                  children: [
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          5, 5, 5, 5),
                                      child: Text(
                                        'Phone',
                                        style: GoogleFonts.getFont(
                                          'Lexend',
                                          color: Colors.black,
                                          fontWeight: FontWeight.w500,
                                          fontSize: 18,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                Row(
                                  children: [
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          5, 5, 5, 5),
                                      child: Text(
                                        PatientDetails['phone'].toString(),
                                        style: GoogleFonts.getFont(
                                          'Lexend Deca',
                                          fontSize: 14,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      Padding(
                        padding: EdgeInsetsDirectional.fromSTEB(0, 5, 0, 0),
                        child: Container(
                          width: MediaQuery.of(context).size.width * 0.90,
                          decoration: BoxDecoration(
                            color: Color.fromARGB(255, 238, 238, 238),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(2, 2, 2, 2),
                            child: Column(
                              children: [
                                Row(
                                  children: [
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          5, 5, 5, 5),
                                      child: Text(
                                        'About',
                                        style: GoogleFonts.getFont(
                                          'Lexend',
                                          color: Colors.black,
                                          fontWeight: FontWeight.w500,
                                          fontSize: 18,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        PatientDetails['disease'].toString(),
                                        style: GoogleFonts.getFont(
                                          'Lexend Deca',
                                          fontSize: 14,
                                        ),
                                      ),
                                    )
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              )
            ]),
          ),

//********************************* */
          //credits
          Container(
            height: size.height,
            width: size.width,
            decoration: BoxDecoration(),
            child: SingleChildScrollView(
              child: Container(
                width: size.width,
                height: size.height - 60,
                child: Stack(
                  children: [
                    Positioned(
                      top: 0,
                      child: Container(
                        width: size.width,
                        height: 360,
                        decoration: const BoxDecoration(
                          color: Colors.white,
                        ),
                        child: Column(
                          children: [
                            Container(
                              margin: const EdgeInsets.only(
                                  top: 32, left: 32, right: 32),
                              child: Material(
                                elevation: 5,
                                borderRadius: BorderRadius.circular(8),
                                child: Container(
                                  height: 70,
                                  padding: const EdgeInsets.only(
                                      left: 20, right: 20),
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Column(
                                        mainAxisSize: MainAxisSize.min,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          const Text(
                                            "Total build points",
                                            style: TextStyle(
                                                fontSize: 14,
                                                fontWeight: FontWeight.w700),
                                          ),
                                          Text(
                                            "" +
                                                userDetails['credits']
                                                    .toString(),
                                            style: TextStyle(
                                                color: Color(0xFFF06129),
                                                fontSize: 34,
                                                fontWeight: FontWeight.w700),
                                          )
                                        ],
                                      ),
                                      Container(
                                        padding: const EdgeInsets.only(
                                            left: 12,
                                            right: 12,
                                            top: 10,
                                            bottom: 10),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFF06129),
                                          borderRadius:
                                              BorderRadius.circular(4),
                                        ),
                                        child: const Text(
                                          "Cash out",
                                          style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold),
                                        ),
                                      )
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            Container(
                              margin: EdgeInsets.only(
                                top: 24,
                              ),
                              child: Text(
                                ongoingTrials['title'].toString(),
                                style: const TextStyle(
                                    fontSize: 14, fontWeight: FontWeight.w700),
                              ),
                            ),
                            Row(
                              children: [
                                Container(
                                  child: Container(
                                      margin:
                                          EdgeInsets.only(top: 120, right: 0),
                                      height: 50,
                                      width: 50,
                                      decoration: BoxDecoration(
                                        borderRadius:
                                            BorderRadius.circular(128),
                                        color: Color.fromRGBO(124, 209, 227, 1),
                                      ),
                                      child: Text("")),
                                ),
                                Container(
                                  child: Container(
                                      margin:
                                          EdgeInsets.only(top: 30, right: 10),
                                      height: 80,
                                      width: 80,
                                      decoration: BoxDecoration(
                                        borderRadius:
                                            BorderRadius.circular(128),
                                        color: Color.fromRGBO(124, 209, 227, 1),
                                      ),
                                      child: Text("")),
                                ),
                                Column(
                                  children: [
                                    CircularPercentIndicator(
                                      radius: 58.0,
                                      lineWidth: 8.0,
                                      percent: userDetails[
                                                      'totalongoingcredit'] ==
                                                  null ||
                                              userDetails['ongoingcredit'] ==
                                                  null
                                          ? 0
                                          : percentagecompleted(),
                                      circularStrokeCap:
                                          CircularStrokeCap.round,
                                      progressColor: Color(0xFFf06129),
                                      backgroundColor: Color(0xFF7CD1E3),
                                      center: SizedBox(
                                        width: 550,
                                        child: Container(
                                          decoration: BoxDecoration(
                                            borderRadius:
                                                BorderRadius.circular(128),
                                          ),
                                          child: Container(
                                            margin: EdgeInsets.only(top: 8),
                                            child: Column(
                                              mainAxisSize: MainAxisSize.min,
                                              mainAxisAlignment:
                                                  MainAxisAlignment.center,
                                              children: [
                                                const Text(
                                                  "Total points",
                                                  style: TextStyle(
                                                      fontSize: 14,
                                                      fontWeight:
                                                          FontWeight.w700),
                                                ),
                                                Text(
                                                  "" +
                                                      userDetails[
                                                              'ongoingcredit']
                                                          .toString(),
                                                  style: TextStyle(
                                                      color: Color(0xFFF06129),
                                                      fontSize: 30,
                                                      fontWeight:
                                                          FontWeight.w700),
                                                )
                                              ],
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                Container(
                                  child: Container(
                                    clipBehavior: Clip.none,
                                    margin: EdgeInsets.only(top: 30, left: 10),
                                    child: Container(
                                        clipBehavior: Clip.hardEdge,
                                        height: 80,
                                        width: 80,
                                        decoration: BoxDecoration(
                                          borderRadius:
                                              BorderRadius.circular(128),
                                          color:
                                              Color.fromRGBO(124, 209, 227, 1),
                                        ),
                                        child: ongoingTrials['image'] != ""
                                            ? Image.network(
                                                ongoingTrials['image']
                                                    .toString(),
                                                fit: BoxFit.cover,
                                              )
                                            : Text("")),
                                  ),
                                ),
                                Container(
                                  child: Container(
                                      margin:
                                          EdgeInsets.only(top: 120, right: 0),
                                      height: 50,
                                      width: 50,
                                      decoration: BoxDecoration(
                                        borderRadius:
                                            BorderRadius.circular(128),
                                        color: Color.fromRGBO(124, 209, 227, 1),
                                      ),
                                      child: Text("")),
                                ),
                              ],
                            )
                          ],
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      child: Stack(
                        children: [
                          SizedBox(
                            width: size.width,
                            height: 500,
                            child: Container(
                              padding:
                                  EdgeInsets.only(top: 64, left: 20, right: 20),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.vertical(
                                  top: Radius.elliptical(
                                    size.width * 0.5,
                                    25.0,
                                  ),
                                ),
                                image: DecorationImage(
                                  fit: BoxFit.cover,
                                  image:
                                      Image.asset("assets/images/bg.png").image,
                                ),
                              ),
                              child: MasonryGridView.count(
                                crossAxisCount: 2,
                                crossAxisSpacing: 30,
                                mainAxisSpacing: 12,
                                itemCount: dummyOffers.length,
                                padding: const EdgeInsets.only(bottom: 40),
                                itemBuilder: (context, index) {
                                  return Container(
                                    decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius:
                                            BorderRadius.circular(15)),
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.start,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: [
                                            Container(
                                                margin: const EdgeInsets.only(
                                                    top: 24, bottom: 24),
                                                child: Image.asset(
                                                    dummyOffers[index].image)),
                                          ],
                                        ),
                                        Container(
                                            padding: EdgeInsets.only(left: 12),
                                            margin: EdgeInsets.only(bottom: 12),
                                            child: Text(
                                                dummyOffers[index].title,
                                                style: const TextStyle(
                                                    fontSize: 14,
                                                    fontWeight:
                                                        FontWeight.bold))),
                                        Container(
                                          padding: const EdgeInsets.only(
                                              left: 12, right: 12, bottom: 16),
                                          child: Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text(
                                                dummyOffers[index].store,
                                                style: const TextStyle(
                                                    color: Color(0xFF7CD1E3),
                                                    fontSize: 14,
                                                    fontWeight:
                                                        FontWeight.bold),
                                              ),
                                              Text(
                                                dummyOffers[index].period,
                                                style: const TextStyle(
                                                    color: Color(0xFFA0A1A8),
                                                    fontSize: 10,
                                                    fontWeight:
                                                        FontWeight.bold),
                                              ),
                                            ],
                                          ),
                                        )
                                      ],
                                    ),
                                  );
                                },
                              ),
                            ),
                          ),
                          Positioned(
                            top: 24,
                            child: SizedBox(
                              width: size.width,
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Text(
                                    "Extra credits",
                                    style: TextStyle(
                                        color: Color(0xFF08323A),
                                        fontSize: 15,
                                        fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    )
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class ActionTile extends StatelessWidget {
  final VoidCallback startFunction;

  final TrialAction action;

  const ActionTile({
    Key? key,
    required this.startFunction,
    required this.action,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      margin: const EdgeInsets.only(right: 12, bottom: 2),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white, width: 1),
        color: action.isDone ? Color(0xFF6B7280) : Color(0xFFFEE4CA),
      ),
      width: 120,
      child: action.isDone
          ? Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  action.when.toUpperCase(),
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w700),
                ),
                const SizedBox(
                  height: 12,
                ),
                Text(
                  action.content,
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.w400),
                ),
                const SizedBox(
                  height: 12,
                ),
                Container(
                  height: 40,
                  child: Center(
                      child: Row(
                    children: [
                      Image.asset("assets/images/done.png"),
                      const SizedBox(
                        width: 4,
                      ),
                      const Text(
                        "Completed",
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold),
                      )
                    ],
                  )),
                ),
              ],
            )
          : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "TODAY",
                  style: TextStyle(
                      color: Color(0xFFF06129),
                      fontSize: 16,
                      fontWeight: FontWeight.w700),
                ),
                const SizedBox(
                  height: 12,
                ),
                Text(
                  action.content,
                  style: const TextStyle(
                      color: Color(0xFF08323A),
                      fontSize: 13,
                      fontWeight: FontWeight.w400),
                ),
                const SizedBox(
                  height: 12,
                ),
                GestureDetector(
                  onTap: () async {
                    final prefs = await SharedPreferences.getInstance();
                    prefs.setString("surveyid", action.id);
                    startFunction();
                  },
                  behavior: HitTestBehavior.opaque,
                  child: Container(
                    height: 40,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(6),
                      color: Color(0xFFF06129),
                    ),
                    child: const Center(
                        child: Text("Start",
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w500))),
                  ),
                ),
              ],
            ),
    );
  }
}
