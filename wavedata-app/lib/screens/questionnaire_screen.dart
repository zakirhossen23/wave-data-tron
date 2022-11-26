import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:wavedata/model/question.dart';
import 'package:wavedata/providers/feeling_provider.dart';
import 'package:wavedata/providers/questionnaire_provider.dart';
import 'package:wavedata/screens/connect_data.dart';
import 'package:wavedata/screens/main_screen.dart';

class QuestionnaireScreen extends ConsumerStatefulWidget {
  const QuestionnaireScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<QuestionnaireScreen> createState() =>
      _QuestionnaireScreenState();
}

class _QuestionnaireScreenState extends ConsumerState<QuestionnaireScreen> {
  var TGheader = {
    "accept-language": "en-US,en;q=0.9",
    "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
  };

  var allSections = [];
  var allCategory = [
    {"name": "", "image": ""}
  ];
  bool isloading = true;
  Future<void> GetData() async {
    final prefs = await SharedPreferences.getInstance();
    String surveyid = prefs.getString("surveyid").toString();
    allSections = [];
    allCategory = [];
    var url = Uri.parse(
        'https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/GetSectionsQuestionsBySurveyID?surveyIDTXT=${surveyid}');
    final response = await http.get(url, headers: TGheader);
    var responseData = json.decode(response.body);
    var data = (responseData['results']);
    var SurveyData = data[0]['SV'];

    var allSect = data[1]['SCV'];

    var allQC = data[2]['SQ'];
    var allCT = data[3]['CT'];
    setState(() {
      for (var i = 0; i < allCT.length; i++) {
        var element = allCT[i];

        allCategory.add({
          "name": element['attributes']['name'],
          "image": element['attributes']['image'],
        });
      }
      for (var i = 0; i < allSect.length; i++) {
        var sectElement = allSect[i]['attributes'];
        var categoryimage = allCategory.firstWhere(
            (element) => element['name'] == sectElement['category']);
        var object = {
          "trialid": SurveyData[0]['attributes']['Tiralid'],
          "surveyid": SurveyData[0]['v_id'],
          "sectionid": sectElement['id'],
          "category": sectElement['category'],
          "description": sectElement['description'],
          "image": categoryimage['image'],
          "questions": []
        };
        var allQuestions = allQC.where((element) =>
            element['attributes']['sectionid'] == sectElement['id']);
        int qid = 1;
        for (var item in allQuestions) {
          var element = item['attributes'];
          var Quction = Question(
              id: qid.toString(),
              questionid: element['id'],
              QuestionType: element['questiontype'],
              QuestionType2: element['questiontype2'],
              content: element['question'],
              Answer: "");
          object['questions'].add(Quction);
          qid++;
        }
        allSections.add(object);
      }
      isloading = false;
    });
  }

  Future<void> SaveData(sectionindex) async {
    setState(() {
      isloading = true;
    });
    final prefs = await SharedPreferences.getInstance();
    String surveyid = prefs.getString("surveyid").toString();
    int userid = int.parse(prefs.getString("userid").toString());
    var item = allSections
        .where((element) => element['sectionid'] == sectionindex)
        .toList()[0];
    int trialid = item['trialid'];
    var sectionid = item['sectionid'];
    for (var itemQ in item['questions']) {
      String questionid = itemQ.questionid;
      String answerTXT = itemQ.Answer;
      var url = Uri.parse(
          'https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/CreateSurveyAnswers?trialidTXT=${(trialid)}&surveyidTXT=${surveyid}&sectionidTXT=${sectionid}&questionidTXT=${questionid}&answerTXT=${answerTXT}&useridTXT=${userid}');
      final response = await http.get(url, headers: TGheader);
      var responseData = json.decode(response.body);
    }
    setState(() {
      isloading = false;
    });
  }

  Future<void> FinishSurvey() async {
    setState(() {
      isloading = true;
    });
    final prefs = await SharedPreferences.getInstance();
    String surveyid = prefs.getString("surveyid").toString();
    int userid = int.parse(prefs.getString("userid").toString());
    try {
      int trialid = allSections[0]['trialid'];
      var url = Uri.parse(
          'https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/CreateSurveyHistory?surveyIDTXT=${(surveyid)}&useridTXT=${userid}&dateTXT=${DateTime.now()}&TrialIDTXT=${trialid}');
      final response = await http.get(url, headers: TGheader);
      var responseData = json.decode(response.body);
    } catch (e) {}

    setState(() {
      isloading = false;
    });
  }

  @override
  initState() {
    GetData();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    var size = MediaQuery.of(context).size;
    var questionnaireViewmodel = ref.watch(questionnaireProvider);

    List<Widget> renderSections() {
      List<Widget> allsection = allSections.map((e) {
        return Column(
          children: [
            Container(
              child: Column(
                children: [
                  Container(
                    child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            child: Text(
                              e['category'],
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                  color: Color(0xFF423838),
                                  fontSize: 24,
                                  fontWeight: FontWeight.w700),
                            ),
                          ),
                          Container(
                            margin: EdgeInsets.only(top: 0, left: 10),
                            child: Container(
                                height: 60,
                                width: 60,
                                child: Image.network(e['image'])),
                          ),
                        ]),
                  ),
                  Container(
                    margin: EdgeInsets.only(left: 10, right: 10),
                    child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Expanded(
                            child: Text(
                              e['description'],
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                  color: Color(0xFF423838),
                                  fontSize: 14,
                                  letterSpacing: 0.82,
                                  fontWeight: FontWeight.w400),
                            ),
                          ),
                        ]),
                  ),
                  SizedBox(
                    height: 12,
                  ),
                  Stack(
                    alignment: Alignment.bottomCenter,
                    children: [
                      Container(
                        width: size.width,
                        height: size.height - size.height / 5,
                        child: ListView.builder(
                          padding: EdgeInsets.only(bottom: 80),
                          itemCount: e['questions'].length,
                          itemBuilder: ((context, index) => QuestionWidget(
                                question: e['questions'][index],
                              )),
                        ),
                      ),
                      Container(
                        margin: EdgeInsets.only(
                            top: 0, left: 24, right: 24, bottom: 24),
                        child: GestureDetector(
                          onTap: () async {
                            setState(() {
                              isloading = true;
                            });
                            await SaveData(e['sectionid']);
                            questionnaireViewmodel.updateIndex(
                                questionnaireViewmodel.selectedIndex + 1);
                          },
                          child: Material(
                            borderRadius: BorderRadius.circular(8),
                            elevation: 2,
                            child: Container(
                              height: 40,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(8),
                                color: Color(0xFFF06129),
                              ),
                              child: Center(
                                child: Text(
                                  "Next",
                                  style: TextStyle(
                                      fontSize: 16, color: Colors.white),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            )
          ],
        );
      }).toList();

      allsection.add(
// Last page
          Column(
        children: [
          Center(
            child: Image.asset(
              "assets/images/welldone.gif",
              width: 200,
            ),
          ),
          Container(
            padding: EdgeInsets.only(left: 64, right: 64),
            child: Text("Well done! You got your first plant",
                textAlign: TextAlign.center,
                style: TextStyle(
                    color: Color(0xFF423838),
                    fontSize: 24,
                    fontWeight: FontWeight.w700)),
          ),
          Container(
            width: 140,
            margin: EdgeInsets.only(top: 24, bottom: 24),
            child: Image.asset(
              "assets/images/plant.png",
              fit: BoxFit.cover,
            ),
          ),
          GestureDetector(
            onTap: () async {
              questionnaireViewmodel.updateIndex(0);
              await FinishSurvey();
              Navigator.pop(context);
            },
            child: Container(
              margin: EdgeInsets.only(top: 24),
              child: Image.asset("assets/images/check.png"),
            ),
          )
        ],
      ));

      return allsection;
    }

    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: isloading == true
              ? [
                  Container(
                    height: size.height,
                    width: size.width,
                    child: Center(
                        child: Container(
                            height: 150,
                            width: 150,
                            child: const SizedBox(
                              child: CircularProgressIndicator(
                                color: Color(0xFFF06129),
                              ),
                              height: 150.0,
                              width: 150.0,
                            ))),
                  )
                ]
              : [
                  isloading == false
                      ? SizedBox(
                          height: 40,
                        )
                      : Text(""),
                  IndexedStack(
                      index: questionnaireViewmodel.selectedIndex,
                      children: renderSections())
                ],
        ),
      ),
    );
  }
}

class QuestionWidget extends StatefulWidget {
  final Question question;
  const QuestionWidget({Key? key, required this.question});

  @override
  _QuestionWidget createState() => _QuestionWidget();
}

class _QuestionWidget extends State<QuestionWidget> {
  @override
  Widget build(BuildContext context) {
    var size = MediaQuery.of(context).size;
    final Question question = widget.question;
    if (question.QuestionType == "rating" && question.QuestionType2 == "1-5") {
      return Container(
        width: size.width,
        margin: EdgeInsets.only(left: 16, right: 16, bottom: 32),
        padding: EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: Color(
            0xFFFEE4CA,
          ),
        ),
        child: Column(
          children: [
            Container(
              margin: EdgeInsets.only(top: 24, bottom: 24),
              padding: EdgeInsets.only(left: 48, right: 48),
              child: Text(
                question.id + ". " + question.content,
                textAlign: TextAlign.center,
                style: TextStyle(
                    color: Color(0xFF423838),
                    fontSize: 16,
                    fontWeight: FontWeight.w700),
              ),
            ),
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          question.Answer = "5";
                        });
                      },
                      child: Container(
                          margin: EdgeInsets.only(left: 24, right: 24),
                          child: question.Answer != "5"
                              ? Image.asset(
                                  "assets/images/moods/5.png",
                                )
                              : Image.asset(
                                  "assets/images/moodspressed/5.png",
                                )),
                    ),
                    Text("Excellent")
                  ],
                ),
                Row(
                  children: [
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          question.Answer = "4";
                        });
                      },
                      child: Container(
                          margin: EdgeInsets.only(left: 24, right: 24),
                          child: question.Answer != "4"
                              ? Image.asset(
                                  "assets/images/moods/4.png",
                                )
                              : Image.asset(
                                  "assets/images/moodspressed/4.png",
                                )),
                    ),
                    Text("Very good")
                  ],
                ),
                Row(
                  children: [
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          question.Answer = "3";
                        });
                      },
                      child: Container(
                          margin: EdgeInsets.only(left: 24, right: 24),
                          child: question.Answer != "3"
                              ? Image.asset(
                                  "assets/images/moods/3.png",
                                )
                              : Image.asset(
                                  "assets/images/moodspressed/3.png",
                                )),
                    ),
                    Text("Good")
                  ],
                ),
                Row(
                  children: [
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          question.Answer = "2";
                        });
                      },
                      child: Container(
                          margin: EdgeInsets.only(left: 24, right: 24),
                          child: question.Answer != "2"
                              ? Image.asset(
                                  "assets/images/moods/2.png",
                                )
                              : Image.asset(
                                  "assets/images/moodspressed/2.png",
                                )),
                    ),
                    Text("Fair")
                  ],
                ),
                Row(
                  children: [
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          question.Answer = "1";
                        });
                      },
                      child: Container(
                          margin: EdgeInsets.only(left: 24, right: 24),
                          child: question.Answer != "1"
                              ? Image.asset(
                                  "assets/images/moods/1.png",
                                )
                              : Image.asset(
                                  "assets/images/moodspressed/1.png",
                                )),
                    ),
                    Text("Poor")
                  ],
                )
              ],
            )
          ],
        ),
      );
    } else if (question.QuestionType == "rating" &&
        question.QuestionType2 == "1-3") {
      return Container(
        width: size.width,
        margin: EdgeInsets.only(left: 16, right: 16, bottom: 32),
        padding: EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: Color(
            0xFFFEE4CA,
          ),
        ),
        child: Column(
          children: [
            Container(
              margin: EdgeInsets.only(top: 24, bottom: 24),
              padding: EdgeInsets.only(left: 48, right: 48),
              child: Text(
                question.id + ". " + question.content,
                textAlign: TextAlign.center,
                style: TextStyle(
                    color: Color(0xFF423838),
                    fontSize: 16,
                    fontWeight: FontWeight.w700),
              ),
            ),
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          question.Answer = "3";
                        });
                      },
                      child: Container(
                          margin: EdgeInsets.only(left: 24, right: 24),
                          child: question.Answer != "3"
                              ? Image.asset(
                                  "assets/images/moods/5.png",
                                )
                              : Image.asset(
                                  "assets/images/moodspressed/5.png",
                                )),
                    ),
                    Text("Excellent")
                  ],
                ),
                Row(
                  children: [
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          question.Answer = "2";
                        });
                      },
                      child: Container(
                          margin: EdgeInsets.only(left: 24, right: 24),
                          child: question.Answer != "2"
                              ? Image.asset("assets/images/moods/3.png")
                              : Image.asset(
                                  "assets/images/moodspressed/3.png")),
                    ),
                    Text("Good")
                  ],
                ),
                Row(
                  children: [
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          question.Answer = "1";
                        });
                      },
                      child: Container(
                          margin: EdgeInsets.only(left: 24, right: 24),
                          child: question.Answer != "1"
                              ? Image.asset("assets/images/moods/1.png")
                              : Image.asset(
                                  "assets/images/moodspressed/1.png")),
                    ),
                    Text("Poor")
                  ],
                )
              ],
            )
          ],
        ),
      );
    }

    return Container(
      width: size.width,
      margin: EdgeInsets.only(left: 16, right: 16, bottom: 32),
      padding: EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: Color(
          0xFFFEE4CA,
        ),
      ),
      child: Column(
        children: [
          Container(
            margin: EdgeInsets.only(top: 24, bottom: 24),
            padding: EdgeInsets.only(left: 48, right: 48),
            child: Text(
              question.id + ". " + question.content,
              textAlign: TextAlign.center,
              style: TextStyle(
                  color: Color(0xFF423838),
                  fontSize: 16,
                  fontWeight: FontWeight.w700),
            ),
          ),
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        question.Answer = "Yes";
                      });
                    },
                    child: Container(
                        margin: EdgeInsets.only(left: 24, right: 24),
                        child: question.Answer != "Yes"
                            ? Image.asset("assets/images/moods/back-yes.png")
                            : Image.asset(
                                "assets/images/moodspressed/back-yes.png")),
                  ),
                  Text("Yes")
                ],
              ),
              Row(
                children: [
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        question.Answer = "No";
                      });
                    },
                    child: Container(
                        margin: EdgeInsets.only(left: 24, right: 24),
                        child: question.Answer != "No"
                            ? Image.asset("assets/images/moods/back-no.png")
                            : Image.asset(
                                "assets/images/moodspressed/back-no.png")),
                  ),
                  Text("No")
                ],
              )
            ],
          )
        ],
      ),
    );
  }
}
