import { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import React from 'react';
import Select from 'react-select';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { PlusSmIcon, ChevronRightIcon, PencilIcon, TrashIcon, PlusIcon, DocumentDuplicateIcon } from "@heroicons/react/solid";
import { PieChart, Pie, Tooltip } from 'recharts';
import axios from 'axios';
import G6 from '@antv/g6';
import UpdateSurveyModal from '../components/modal/UpdateSurvey'
function SurveyDetails() {
   var Thisstate = {
      sectionsloaded: false,
      data: []
   }
   const params = useParams();
   const navigate = useNavigate();
   let location = useLocation();
   const [tabIndex, setTabIndex] = useState(0);

   const [TRIAL_DATA, setTRIAL_DATA] = useState({})
   const [SURVEY_DATA, setSURVEY_DATA] = useState({})
   const [UpdatemodalShow, setModalShow] = useState(false);
   const [status, setstatus] = useState("");


   const [sectionsdata, setsectionsdata] = useState([
      {
         category: "",
         description:"",
         id: "",
         surveyID: 0
      },
   ])

   const [dataCategory, setdataCategory] = useState([])
   const [sectionsQuestionsdata, setsectionsQuestionsdata] = useState([
      {
         id: "",
         sectionid: "",
         questiontype: "",
         surveyid: "",
         question: "",
         questiontype2: ""
      },
   ])

   const [LimitedAnswerdata, setLimitedAnswerdata] = useState([
      {
         id: "",
         questionid: "",
         answer: "",
      },
   ])
   const TABS = [
      {
         id: 'questions',
         title: 'Questions',
      },
      {
         id: 'responses',
         title: 'Responses',
      },
   ];

   async function AddCategory(e) {
      setstatus("saving...")
      var BTN = e.currentTarget;
      BTN.disabled = true; BTN.classList.remove("hover:bg-white"); BTN.classList.remove("cursor-pointer");
      var categoryname = document.getElementsByName("categoryName")[0]
      var categoryimagelink = document.getElementsByName("imagelink")[0]
      var Work = new Promise(async (resolve, reject) => {
         const textwork = `createCategories?nameTXT=${categoryname.value}&imageTXT=${categoryimagelink.value}`;
         await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/${textwork}`, {
            "headers": {
               "accept-language": "en-US,en;q=0.9",
               "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
            },
            "body": null,
            "method": "GET"
         }).then(e => {
            setdataCategory(prevState => [...prevState, {
               text: categoryname.value,
               value: categoryname.value,
               icon: <img className="w-6 h-6" src={categoryimagelink.value} />
            }]);
            categoryname.value = "";
            categoryimagelink.value = "";
            setstatus("saved!")
            BTN.disabled = false; BTN.classList.add("hover:bg-white"); BTN.classList.add("cursor-pointer");
            resolve(e.json)
         })

      });
      await Work
   }



   function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
   }
   async function addSection(e) {
      setstatus("saving...")
      var addSectionBTN = e.currentTarget;
      addSectionBTN.classList.remove("hover:bg-gray-600")
      addSectionBTN.classList.remove("bg-black")
      addSectionBTN.classList.add("bg-gray-400")
      addSectionBTN.classList.add("cursor-default")
      addSectionBTN.disabled = true;
      await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/CreateSection?SurveyidTXT=${(params.id)}`, {
         "headers": {
            "accept-language": "en-US,en;q=0.9",
            "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
         },
         "body": null,
         "method": "GET"
      }).then(e => { return e.json() }).then(e2 => {
         setsectionsdata(prevState => [...prevState, {
            id: e2.results[0].ID,
            category: ""
         }]);
         addSectionBTN.classList.add("hover:bg-gray-600")
         addSectionBTN.classList.add("bg-black")
         addSectionBTN.classList.remove("bg-gray-400")
         addSectionBTN.classList.remove("cursor-default")
         addSectionBTN.disabled = false;
         setstatus("saved!")
      })


   };

   async function addQuestion(e) {
      setstatus("saving...")
      var addQuestionBTN = e.currentTarget;
      let sectionsidTXT = e.currentTarget.getAttribute("sectionsid");
      addQuestionBTN.classList.remove("hover:bg-gray-600")
      addQuestionBTN.classList.remove("bg-black")
      addQuestionBTN.classList.add("bg-gray-400")
      addQuestionBTN.classList.add("cursor-default")
      addQuestionBTN.disabled = true;

      await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/CreateQuestion?sectionidTXT=${encodeURIComponent(sectionsidTXT)}&surveyID=${encodeURIComponent(params.id)}&trialidTXT=${parseInt(location.state.trialID)}`, {
         "headers": {
            "accept-language": "en-US,en;q=0.9",
            "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
         },
         "body": null,
         "method": "GET"
      }).then(e => { return e.json() }).then(e2 => {
         
         setsectionsQuestionsdata(prevState => [...prevState, {
            id: e2.results[0].ID,
            sectionid: sectionsidTXT,
            questiontype: "rating",
            surveyid: params.id,
            question: "",
            questiontype2: "1-5"
         }]);
         addQuestionBTN.classList.add("hover:bg-gray-600")
         addQuestionBTN.classList.add("bg-black")
         addQuestionBTN.classList.remove("bg-gray-400")
         addQuestionBTN.classList.remove("cursor-default")


         addQuestionBTN.disabled = false;
         setstatus("saved!")
      }).catch(err=>{
         console.error(err)
      })


   };

   async function LoadDataTrial() {
      setstatus("loading...")
      setTRIAL_DATA({})
      await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/GetTrial?idTXT=${parseInt(location.state.trialID)}`, {
         "headers": {
            "accept-language": "en-US,en;q=0.9",
            "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
         },
         "body": null,
         "method": "GET"
      }).then(e => {
         return e.json();
      }).then(e => {
         setTRIAL_DATA(e.results[0]['(SV)'][0].attributes);
         setstatus("loaded!")
      })
   }
   async function LoadSurveyData() {
      setstatus("loading...")
      setSURVEY_DATA({})
      await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/SelectSurveyByID?idTXT=${encodeURIComponent(params.id)}`, {
         "headers": {
            "accept-language": "en-US,en;q=0.9",
            "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
         },
         "body": null,
         "method": "GET"
      }).then(e => {
         return e.json();
      }).then(e => {
         console.log(e.results[0]['(SV)'])
         setSURVEY_DATA(e.results[0]['(SV)'][0].attributes);
         setstatus("loaded!")
      })
   }

   async function LoadDataSections() {
      setstatus("loading...")
      setsectionsdata([])
      sleep(100)
      await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/LoadSection?surveyIDTXT=${encodeURIComponent(params.id)}`, {
         "headers": {
            "accept-language": "en-US,en;q=0.9",
            "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
         },
         "body": null,
         "method": "GET"
      }).then(e => {
         return e.json();
      }).then(e => {
         e.results[0].SV.forEach(async element => {
            setsectionsdata(prevState => [...prevState, element.attributes]);
         });
         Thisstate.sectionsloaded = true;
         setstatus("loaded!")
      })
   }
   async function LoadDataQuestions() {
      setstatus("loading...")
      setsectionsQuestionsdata([])
      sleep(100)
      await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/LoadQuestionBySurveyID?surveyIDTXT=${encodeURIComponent(params.id)}`, {
         "headers": {
            "accept-language": "en-US,en;q=0.9",
            "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
         },
         "body": null,
         "method": "GET"
      }).then(e => {
         return e.json();
      }).then(e => {
         e.results[0].SV.forEach(async element => {
            setsectionsQuestionsdata(prevState => [...prevState, element.attributes]);
         });
         Thisstate.sectionsloaded = true;
         setstatus("loaded!")
      })
   } async function LoadDataCategories() {
      setstatus("loading...")
      setdataCategory([])
      sleep(100)
      await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/GetCategories`, {
         "headers": {
            "accept-language": "en-US,en;q=0.9",
            "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
         },
         "body": null,
         "method": "GET"
      }).then(e => {
         return e.json();
      }).then(e => {
         e.results[0].SV.forEach(async element => {
            setdataCategory(prevState => [...prevState, {
               value: element.attributes['name'],
               text: element.attributes['name'],            
               icon: <img className="w-6 h-6" src={element.attributes['image']} />
            }]);
         });
         setstatus("loaded!")
      })
   }
   async function LoadDataLimitedAnswers() {
      setstatus("loading...")
      setLimitedAnswerdata([])
      sleep(100)
      await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/LoadLimitedAnswers?surveyIDTXT=${parseInt(params.id)}`, {
         "headers": {
            "accept-language": "en-US,en;q=0.9",
            "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
         },
         "body": null,
         "method": "GET"
      }).then(e => {
         return e.json();
      }).then(e => {
         e.results[0].SV.forEach(async element => {
            setLimitedAnswerdata(prevState => [...prevState, element.attributes]);
         });
         setstatus("loaded!")
      })
   }


   async function AddLimitedAnswer(e, item) {
      setstatus("saving...")
      var AddLimitedBTN = e.currentTarget;
      AddLimitedBTN.classList.remove("hover:bg-white")
      AddLimitedBTN.classList.add("bg-gray-300")
      AddLimitedBTN.classList.add("cursor-default")
      AddLimitedBTN.disabled = true;
      let questionidTXT = item.id;
      await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/CreateLimitedAnswer?questionidTXT=${encodeURIComponent(questionidTXT)}&surveyidTXT=${encodeURIComponent(params.id)}&sectionidTXT=${encodeURIComponent(item.sectionid)}&trialidTXT=${parseInt(location.state.trialID)}`, {
         "headers": {
            "accept-language": "en-US,en;q=0.9",
            "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
         },
         "body": null,
         "method": "GET"
      }).then(e => { return e.json() }).then(e2 => {
         setLimitedAnswerdata(prevState => [...prevState, {
            id: e2.results[0].ID,
            questionid: item.id,
            answer: ""
         }]);
         AddLimitedBTN.classList.add("hover:bg-white")
         AddLimitedBTN.classList.remove("bg-gray-300")
         AddLimitedBTN.classList.remove("cursor-default")
         AddLimitedBTN.disabled = false;
         setstatus("saved!")
      })


   }

   async function updateSections() {
      setstatus("saving...")
      var done = new Promise(async (resolve, reject) => {
         await sectionsdata.forEach(async (element) => {
            const textUpdate = `UpdateSection?idTXT=${encodeURIComponent(element.id)}&categoryTXT=${encodeURIComponent(element.category)}`
            var waitUpdate = new Promise(async (resolve2, reject) => {
               await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/${textUpdate}`, {
                  "headers": {
                     "accept-language": "en-US,en;q=0.9",
                     "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
                  },
                  "body": null,
                  "method": "GET"
               }).then(e => {
                  resolve2(e.json)
                  setstatus("saved!")
               })
            });
            await waitUpdate;
         });
         resolve(sectionsdata);

      })
      await done

   }

   
   async function updateSectionsDescription() {
      setstatus("saving...")
      var done = new Promise(async (resolve, reject) => {
         await sectionsdata.forEach(async (element) => {
            const textUpdate = `UpdateSectionDescription?idTXT=${encodeURIComponent(element.id)}&DescriptionTXT=${encodeURIComponent(element.description)}`
            var waitUpdate = new Promise(async (resolve2, reject) => {
               await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/${textUpdate}`, {
                  "headers": {
                     "accept-language": "en-US,en;q=0.9",
                     "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
                  },
                  "body": null,
                  "method": "GET"
               }).then(e => {
                  resolve2(e.json)
                  setstatus("saved!")
               })
            });
            await waitUpdate;
         });
         resolve(sectionsdata);

      })
      await done

   }
   async function updateQuestionType(idTXT, typeTXT) {
      setstatus("saving...")
      const textUpdate = `UpdateQuestion?idTXT=${encodeURIComponent(idTXT)}&typeTXT=${encodeURIComponent(typeTXT)}&questionTXT=""&way=type&questiontype2TXT=${encodeURIComponent()}`
      await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/${textUpdate}`, {
         "headers": {
            "accept-language": "en-US,en;q=0.9",
            "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
         },
         "body": null,
         "method": "GET"
      }).then(e => {
         setstatus("saved!")
         return e.json;

      })
   }
   async function updateQuestionAnswerType(idTXT, typeAnserTXT) {
      setstatus("saving...")
      const textUpdate = `UpdateQuestion?idTXT=${encodeURIComponent(idTXT)}&way=answertype&questiontype2TXT=${encodeURIComponent(typeAnserTXT)}`
      await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/${textUpdate}`, {
         "headers": {
            "accept-language": "en-US,en;q=0.9",
            "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
         },
         "body": null,
         "method": "GET"
      }).then(e => {
         setstatus("saved!")
         return e.json;
      })
   }


   function RatingAnswer({ item }) {
      return (<><div className="ml-4 bg-white" style={{ width: '48.7%' }} id={`AnswerType${item.id}`}>
         <select id="testID" defaultValue={item.questiontype2} onChange={(e) => { sectionsQuestionsdata.filter(es => es.id == item.id)[0].questiontype2 = e.target.value; updateQuestionAnswerType(item.id, e.target.value) }} className="h-10 px-1 rounded-md border border-gray-200 outline-none " style={{ "width": "100%" }}>
            <option value="1-3">Rating from 1 to 3</option>
            <option value="1-5">Rating from 1 to 5</option>
         </select>
      </div></>)
   }

   function AnswerTypeJSX({ item }) {
      function Allanswer({ item }) {
         var all = []
         LimitedAnswerdata.filter(e => { return e.questionid == item.id }).map((itemQuestions, index) => {
            all.push(<>
               <div style={{ display: "flex", width: "49%", alignItems: "center", fontSize: 19, justifyContent: "space-between" }} className="mt-3">
                  <span style={{ fontWeight: 700 }}>Answer {index + 1}</span>
                  <input onKeyUp={(e) => { LimitedAnswerdata.filter(e2 => e2.id == itemQuestions.id)[0].answer = e.target.value; startTypingLimitedAnswers(e, itemQuestions) }} type="text" defaultValue={itemQuestions.answer} className="border py-1 px-2" placeholder="Answer" style={{ width: "69%" }} />
                  <button onClick={(e) => { DeleteLimitedAnswer(e, itemQuestions) }} orderid={index} className="flex w-[52px] h-10 border border-gray-400 bg-gray-200 rounded-md justify-center items-center hover:bg-white">
                     <TrashIcon className="w-5 h-5" />
                  </button>
               </div>
            </>);
         })

         return all;

      }
      return (<>
         <div className="w-full ml-0" id={`AnswerType${item.id}`}>
            <div>
               <Allanswer item={item} />

               <button onClick={(e) => AddLimitedAnswer(e, item)} className="h-10 mt-3 rounded-md border-solid border bg-gray-100 flex py-2 px-4 items-center text-gray-700 hover:bg-white">
                  <PlusSmIcon className="w-5 h-5 " />
                  <p className="ml-2"> Answer</p>
               </button>
            </div>
         </div>

      </>)
   }
   function QustionsWithType(questionid, itemQuestions, type) {

      var answerplace = document.getElementById(`AnswerType${questionid}`)
      try {
         ReactDOM.unmountComponentAtNode(answerplace)
      } catch (error) {
      }

      sectionsQuestionsdata.filter((e) => { return e.id == questionid })[0].questiontype = type;

      updateQuestionType(questionid, type);
      if (type === "rating") {
         answerplace.style = `width: 47.2%;`;
         answerplace.innerHTML = `
         <select class="h-10 px-1 rounded-md border border-gray-200 outline-none bg-white" style="width: 100%">
         <option value="1-3">Rating from 1 to 3</option>
         <option value="1-5">Rating from 1 to 5</option>
         
      </select>
         `
      } else if (type === "yes/no") {
         try {
            answerplace.innerHTML = ""
         } catch (error) { }

      } else if (type === "limited") {
         try {
            answerplace.className = ""
            answerplace.style = `width: 100%;`;
         } catch (error) { }

         sectionsQuestionsdata.filter((e) => { return e.id == questionid })[0].questiontype2 = ""
         updateQuestionAnswerType(questionid, "")
         ReactDOM.render(
            <AnswerTypeJSX item={itemQuestions} />,
            answerplace
         );
      } else if (type === "open") {
         try {
            answerplace.innerHTML = ""
         } catch (error) { }
      }
   }

   async function deleteSurvey() {
      setstatus("saving...")
      document.getElementById("surveyDelete").disabled = true;
      document.getElementById("surveyDelete").classList.remove("hover:bg-white");
      document.getElementById("surveyDelete").classList.remove("cursor-pointer");
      var Delete = new Promise(async (resolve, reject) => {
         const textDelete = `DeleteSurvey?idTXT=${encodeURIComponent(params.id)}`;
         await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/${textDelete}`, {
            "headers": {
               "accept-language": "en-US,en;q=0.9",
               "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
            },
            "body": null,
            "method": "GET"
         }).then(e => {
            setstatus("saved!")
            resolve(e.json)
         })

      });
      await Delete
      navigate(`/trials/${location.state.trialID}`, { replace: true })
      document.getElementById("surveyDelete").disabled = false;
      document.getElementById("surveyDelete").classList.add("hover:bg-white");
      document.getElementById("surveyDelete").classList.add("cursor-pointer");
   }
   async function removeElementFromArray(all, specificid, seting) {
      seting([])
      var storing = [];
      for (let index = 0; index < all.length; index++) {
         const element = all[index];
         if (index == specificid) {
            continue
         }
         storing.push(element)
      }

      seting(storing)

      console.log("done")
   }
   async function removeElementFromArrayBYID(all, specificid, seting) {
      seting([])
      var storing = [];
      for (let index = 0; index < all.length; index++) {
         const element = all[index];
         if (element.id == specificid) {
            continue
         }
         storing.push(element)
      }

      seting(storing)

      console.log("done")
   }

   async function deleteSection(e) {
      setstatus("saving...")
      var sectionDeleteBTN = e.currentTarget;
      let sectionid = sectionDeleteBTN.getAttribute("sectionid")
      let sectionindexid = sectionDeleteBTN.getAttribute("sectionindexid")
      sectionDeleteBTN.disabled = true;
      sectionDeleteBTN.classList.remove("hover:bg-white");
      sectionDeleteBTN.classList.remove("cursor-pointer");
      var Delete = new Promise(async (resolve, reject) => {
         const textDelete = `DeleteSection?idTXT=${decodeURIComponent(sectionid)}`;
         await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/${textDelete}`, {
            "headers": {
               "accept-language": "en-US,en;q=0.9",
               "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
            },
            "body": null,
            "method": "GET"
         }).then(e => {
            setstatus("saved!")
            resolve(e.json)
         })

      });
      await Delete
      await removeElementFromArray(sectionsdata, sectionindexid, setsectionsdata)
      sectionDeleteBTN.disabled = false;
      sectionDeleteBTN.classList.add("hover:bg-white");
      sectionDeleteBTN.classList.add("cursor-pointer");
   }
   async function deleteQuestion(e) {
      setstatus("saving...")
      var DeleteQuestionBTN = e.currentTarget;
      DeleteQuestionBTN.disabled = true; DeleteQuestionBTN.classList.remove("hover:bg-white"); DeleteQuestionBTN.classList.remove("cursor-pointer");
      let questionid = DeleteQuestionBTN.getAttribute("questionid")
      var Delete = new Promise(async (resolve, reject) => {
         const textDelete = `DeleteQuestion?idTXT=${encodeURIComponent(questionid)}`;
         await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/${textDelete}`, {
            "headers": {
               "accept-language": "en-US,en;q=0.9",
               "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
            },
            "body": null,
            "method": "GET"
         }).then(e => {
            setstatus("saved!")
            resolve(e.json)
         })

      });
      await Delete
      removeElementFromArrayBYID(sectionsQuestionsdata, questionid, setsectionsQuestionsdata)
   }
   async function DeleteLimitedAnswer(e, item) {
      setstatus("saving...")
      var DeleteBTN = e.currentTarget;
      DeleteBTN.disabled = true; DeleteBTN.classList.remove("hover:bg-white"); DeleteBTN.classList.remove("cursor-pointer");
      let id = item.id
      let orderid = DeleteBTN.getAttribute("orderid")
      var Delete = new Promise(async (resolve, reject) => {
         const textDelete = `DeleteLimitedAnswerByID?idTXT=${encodeURIComponent(id)}`;
         await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/${textDelete}`, {
            "headers": {
               "accept-language": "en-US,en;q=0.9",
               "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
            },
            "body": null,
            "method": "GET"
         }).then(e => {
            setstatus("saved!")
            resolve(e.json)
         })

      });
      await Delete
      removeElementFromArrayBYID(LimitedAnswerdata, id, setLimitedAnswerdata)
   }

   async function duplicateQuestion(e, item) {
      setstatus("saving...")
      var DuplicateBTN = e.currentTarget;
      DuplicateBTN.disabled = true; DuplicateBTN.classList.remove("hover:bg-white"); DuplicateBTN.classList.remove("cursor-pointer");
      let id = item.id
      var Duplicate = new Promise(async (resolve, reject) => {
         const textDelete = `DeleteLimitedAnswerByID?idTXT=${encodeURIComponent(id)}`;
         await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/${textDelete}`, {
            "headers": {
               "accept-language": "en-US,en;q=0.9",
               "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
            },
            "body": null,
            "method": "GET"
         }).then(e => {
            resolve(e.json)
         })

      });
      await Duplicate
   }

   useEffect(async() => {
      LoadDataTrial();
     await LoadDataCategories()
      LoadSurveyData()
      LoadDataSections();
      LoadDataQuestions()
   
      LoadDataLimitedAnswers()

   }, [])
   //setup before functions
   var typingTimer;                //timer identifier
   var descriptiontypingTimer;                //timer identifier
   var doneTypingInterval = 100;  //time in ms, 1 seconds for example

   function startTyping(e) {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => doneTypingQuestion(e), doneTypingInterval);
   }

   function startTypingDescription(e) {
      clearTimeout(descriptiontypingTimer);
      descriptiontypingTimer = setTimeout(() => doneTypingDescription(e), doneTypingInterval);
   }



   //user is "finished typing," do something
   function doneTypingQuestion(e) {
      setstatus("saving...")
      var inputbox = e.target;
      let questionid = inputbox.getAttribute("questionid")
      let questionTXT = inputbox.value;
      sectionsQuestionsdata.filter(e2 => { return e2.id == questionid })[0].question = questionTXT; 
      const textUpdate = `UpdateQuestion?idTXT=${encodeURIComponent(questionid)}&typeTXT=""&questionTXT=${encodeURIComponent(questionTXT)}&way=question`
      fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/${textUpdate}`, {
         "headers": {
            "accept-language": "en-US,en;q=0.9",
            "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
         },
         "body": null,
         "method": "GET"
      }).then(e => {
         setstatus("saved!")
         return e.json;

      })

      console.log("changed", e)
   }

   async function doneTypingDescription(e) {
      setstatus("saving...")
      var inputbox = e.target;
      let id = inputbox.getAttribute("sectionid")
      let DescriptionTXT = inputbox.value;
      const textUpdate = `UpdateSectionDescription?idTXT=${encodeURIComponent(id)}&DescriptionTXT=${encodeURIComponent(DescriptionTXT)}`
      var waitUpdate = new Promise(async (resolve2, reject) => {
         await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/${textUpdate}`, {
            "headers": {
               "accept-language": "en-US,en;q=0.9",
               "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
            },
            "body": null,
            "method": "GET"
         }).then(e => {
            resolve2(e.json)
            setstatus("saved!")
         })
      });
      await waitUpdate;


      console.log("changed", e)
   }

   function startTypingLimitedAnswers(e, item) {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => doneTypingLimited(e, item), doneTypingInterval);
   }
   function doneTypingLimited(e, item) {
      setstatus("saving...")
      var inputbox = e.target;
      let answerid = item.id;
      let answerTXT = inputbox.value;
      const textUpdate = `UpdateLimitedQuestion?idTXT=${encodeURIComponent(answerid)}&answerTXT=${encodeURIComponent(answerTXT)}`
      fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/${textUpdate}`, {
         "headers": {
            "accept-language": "en-US,en;q=0.9",
            "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
         },
         "body": null,
         "method": "GET"
      }).then(e => {
         setstatus("Saved!")
         return e.json;
      })
      console.log("changed", e)

   }

   async function loadGraph() {

      for (let sectindex = 0; sectindex < sectionsdata.length; sectindex++) {
         setstatus("loadng...")
         for (let index = 0; index < sectionsQuestionsdata.length; index++) {
            const eleQ = sectionsQuestionsdata[index];
            axios
               .post(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/GetSurveyAnswers?questionidTXT=${encodeURIComponent(eleQ.id)}`, {}, {
                  headers: {
                     "accept-language": "en-US,en;q=0.9",
                     "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
                  }
               }).then((res) => {
                  if (res.status === 200) {
                     var answersids = [];
                     var alldata = [];
                     var allusersData = res.data['results'][1]['USERS'];
                     res.data['results'][0]['SV'].forEach(element => {
                        answersids.push(element['attributes']['answer'])
                        alldata.push(element['attributes'])

                     });
                     console.log(allusersData);
                     var count = 0;
                     var children = [];

                     function GetUsers(answer) {
                        var allusers = [];
                        var usercount = 0;
                        alldata.forEach(element => {
                           if (element['answer'] == answer) {
                              var userdata = allusersData.filter(e => e.userid == element['userid'])[0];
                              allusers.push({
                                 "children": [],
                                 "email": userdata['email'],
                                 "id": `${userdata['username']}${usercount.toString()}`,
                                 "name": userdata['username'],
                                 "style": {
                                    "fill": "#c99cdf",
                                    "stroke": "#A800FB"
                                 }

                              })
                           }
                        })
                        return allusers;
                     }

                     answersids.forEach(element => {
                        children.push({
                           "children": GetUsers(element),
                           "id": "answer " + count.toString(),
                           "name": `Answer ${element}`,
                           "style": {
                              "fill": "#d28b69",
                              "stroke": "#F9641D"
                           }
                        })
                        count++;
                     })
                     var result = {
                        "name": "question",
                        "id": "question",
                        "children": children,
                        "style": {
                           "fill": "#FFD8D9",
                           "stroke": "#FF6D67",
                        }
                     }

                     Thisstate.data = result;
                     const container = document.getElementById(`section${sectindex}container${index}`);
                     const width = 400;
                     const height = 400;
                     container.innerHTML = "";
                     const graph = new G6.TreeGraph({
                        container: `section${sectindex}container${index}`,
                        width,
                        height,
                        modes: {
                           default: [
                              {
                                 type: 'collapse-expand',
                                 onChange: function onChange(item, collapsed) {
                                    const data = item.get('model');
                                    data.collapsed = collapsed;
                                    return true;
                                 },
                              },
                              'drag-canvas',
                              'zoom-canvas',
                              'drag-node',
                              'activate-relations',
                           ],
                        },
                        defaultNode: {
                           size: 55,
                        },
                        layout: {
                           type: 'dendrogram',
                           direction: 'RL',
                           nodeSep: 10,
                           rankSep: 200,
                           radial: true,
                        },
                     });
                     graph.node(function (node) {
                        console.log("here=>", node);
                        return {
                           label: `${node['name']}`
                        };
                     });

                     graph.edge(function (node) {
                        return {
                           label: `${node.id}`,
                        };
                     });

                     graph.data(Thisstate.data);

                     graph.render();
                     graph.fitView();
                     graph.get('canvas').set('localRefresh', false);
                     graph.on('node:click', (evt) => {
                        const nodeItem = evt.item;
                        if (!nodeItem) return;
                        const item = nodeItem.getModel();
                        if (item.url) {
                           window.open(item.url);
                        }
                     });
                     if (typeof window !== 'undefined')
                        window.onresize = () => {
                           if (!graph || graph.get('destroyed')) return;
                           if (
                              !container ||
                              !container.scrollWidth ||
                              !container.scrollHeight
                           )
                              return;
                           graph.changeSize(container.scrollWidth, container.scrollHeight);
                        };

                  }
                  setstatus("loaded!")
               })
               .catch((err) => {
                  console.error(err);
               });
         }
      }



   }
   useEffect(() => {
      loadGraph();
   }, [tabIndex])
   return (
      <>
         <div className="bg-white border border-gray-400 rounded-lg py-4 px-6 flex mb-2 items-center">
            <div onClick={() => navigate(-2)} className="flex items-center hover:cursor-pointer hover:underline decoration-gray-400">
               <p className="text-gray-400">Trials</p>
               <ChevronRightIcon className="mx-1 w-5 h-5 text-gray-400" />
            </div>
            <div onClick={() => navigate(-1)} className="flex items-center hover:cursor-pointer hover:underline decoration-gray-400">
               <p className="text-gray-400">{TRIAL_DATA?.title}</p>
               <ChevronRightIcon className="mx-1 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center">
               <p className="text-gray-400">{SURVEY_DATA?.name}</p>
            </div>
         </div>
         <div className={`bg-white border border-gray-400 rounded-lg overflow-hidden mb-2`}>

            <div className="flex p-6">
               <img src={SURVEY_DATA?.image} alt="Survey" className="w-[128px] h-[128px] object-cover" />
               <div className="mx-8 flex-1">
                  <p className="text-3xl font-semibold">{SURVEY_DATA?.name}</p>
                  <p className="mt-6">{SURVEY_DATA?.description}</p>
               </div>
               <div className="flex">
                  <button onClick={() => { setModalShow(true) }} className="flex w-[52px] h-10 border border-gray-400 bg-gray-200 rounded-md justify-center items-center hover:bg-white">
                     <PencilIcon className="w-5 h-5 text-gray-400" />
                  </button>
                  <button id="surveyDelete" onClick={deleteSurvey} className="flex w-[52px] h-10 border border-gray-400 bg-gray-200 rounded-md justify-center items-center mx-1 hover:bg-white">
                     <TrashIcon className="w-5 h-5 text-gray-400" />
                  </button>
                  <button onClick={addSection} className="h-10 rounded-md shadow-md bg-black text-white flex py-2 px-4 items-center hover:bg-gray-700 hover:text-gray-500">
                     <PlusSmIcon className="w-5 h-5 " />
                     <p className=" ml-2">Section</p>
                  </button>
               </div>
            </div>

         </div>
         <div className="bg-white border border-gray-400 rounded-lg flex mt-4 px-4">
            {TABS.map(({ id, title }, index) => {
               const IS_LAST = index === TABS.length - 1;
               const ACTIVE = index === tabIndex;

               return (
                  <>
                     <div className="self-stretch w-[1px] bg-gray-400" />
                     <button key={id} onClick={() => setTabIndex(index)} className={`flex items-center h-14 p-4 ${ACTIVE ? 'bg-gray-100' : 'bg-white'}`}>
                        <p className={`${ACTIVE ? 'text-orange-500' : 'text-black'} font-medium`}>{title}</p>
                     </button>
                     {IS_LAST && <div className="self-stretch w-[1px] bg-gray-400" />}
                  </>
               );
            })}
         </div>
         {tabIndex === 0 && (
            <>
               {sectionsdata.map((item, index) => {
                  const sectindex = item.id;
                  return (
                     <div for={sectindex} className="bg-white border border-gray-400 rounded-lg flex flex-col mt-4">
                        <div className="bg-gray-100 py-4 px-6 border-b border-b-gray-400">
                           <div className="flex mb-4 items-center">
                              <p className="text-2xl font-semibold">{`Section ${index + 1}`}</p>
                              <span className="text-gray-600 flex-1 ml-2">{status}</span>
                              <button id={`Trash-sectionid-${sectindex}`} sectionid={sectindex} sectionindexid={index} onClick={(e) => { deleteSection(e) }} className="flex w-[52px] h-10 border border-gray-400 bg-gray-200 rounded-md justify-center items-center hover:bg-white">
                                 <TrashIcon className="w-5 h-5 text-gray-400" />
                              </button>
                              <button className="flex w-[52px] h-10 border border-gray-400 bg-gray-200 rounded-md justify-center items-center ml-1">
                                 <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
                              </button>
                           </div>
                           <label for={`category-select${sectindex}`} className="font-semibold mr-4">Category:</label>
                           <div className="flex">
                              <Select
                                 className=" rounded-md  outline-none w-1/3"
                                 name={`category${sectindex}`}
                                 id={`category-select${sectindex}`}
                                 placeholder="Select Category"
                                 onChange={(e) => { sectionsdata[index].category = e.value; updateSections() }}
                                 options={dataCategory}
                                 isSearchable={true}
                                 defaultValue={e=>{
                                    console.log("category",dataCategory)
                                    return dataCategory.filter(element => element['value']==sectionsdata[index].category)[0];
                                 }
                                    }
                                 getOptionLabel={e => (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                       {e.icon}
                                       <span style={{ marginLeft: 5 }}>{e.text}</span>
                                    </div>
                                 )}
                              />
                              <input type="text" className="border py-1 px-2" name="categoryName" placeholder="Category name" />
                              <input type="text" className="border py-1 px-2" name="imagelink" placeholder="Image link" />
                              <button onClick={AddCategory} className="flex w-[52px] h-11 border border-gray-400 bg-gray-200 rounded-md justify-center items-center hover:bg-white">
                                 <PlusIcon className="w-5 h-5 text-gray-400" />
                              </button>
                           </div>
                           <div >

                              <textarea className="border py-1 px-2 w-full" name="categoryName" onKeyUp={(e) => { sectionsdata[index].description = e.target.value; startTypingDescription(e) }} onChange={(e) => { sectionsdata[index].description = e.target.value; startTypingDescription(e) }}  sectionid={item.id} defaultValue={item.description} placeholder="Description" />

                           </div>
                        </div>
                        {sectionsQuestionsdata.filter(e => { return e.sectionid == sectindex }).map((itemQuestions, index) => {
                           return (
                              <div className="border-b border-b-gray-400 p-4">
                                 <div className="flex mb-2 items-center">
                                    <p className="text-2xl font-semibold flex-1">{`Question ${index + 1}`}</p>
                                    <button questionid={itemQuestions.id} questionidOrder={index} onClick={(e) => { deleteQuestion(e) }} className="flex w-[52px] h-10 border border-gray-400 bg-gray-200 rounded-md justify-center items-center hover:bg-white">
                                       <TrashIcon className="w-5 h-5 text-gray-400" />
                                    </button>
                                    <button onClick={(e) => { duplicateQuestion(e, itemQuestions) }} className="flex w-[52px] h-10 border border-gray-400 bg-gray-200 rounded-md justify-center items-center ml-1">
                                       <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
                                    </button>
                                 </div>
                                 <input type="text" onKeyUp={(e) => {
                                      startTyping(e);
                                      }} onChange={(e) => {
                                       startTyping(e);
                                       }} defaultValue={itemQuestions.question} questionid={itemQuestions.id}  className="border py-1 px-2 w-full" placeholder="What is your question?" />

                                 <div className="flex flex-wrap mt-2">
                                    <select name={`questiontype${index}`} defaultValue={itemQuestions.questiontype} onChange={(e) => { sectionsQuestionsdata.filter(e2 => { return e2.id == itemQuestions.id })[0].questiontype = e.target.value; QustionsWithType(itemQuestions.id, itemQuestions, e.target.value) }} sectionid={sectindex} questionid={itemQuestions.id} id={`questiontype${index}`} className="h-10 px-1 rounded-md border border-gray-200 outline-none " style={{ width: "49%", "fontFamily": "FontAwesome" }}>
                                       <option value="rating" className="fa-solid"> &#xf118; Rating question</option>
                                       <option value="yes/no">&#xf058; Yes/no question</option>
                                       <option value="limited">&#xf0c9; Limited question</option>
                                       <option value="open">&#xf059; Open question</option>
                                    </select>

                                    {(itemQuestions.questiontype === "rating") && (
                                       <RatingAnswer item={itemQuestions} />
                                    )}
                                    {(itemQuestions.questiontype === "limited") && (
                                       <AnswerTypeJSX item={itemQuestions} />
                                    )}

                                 </div>
                              </div>
                           );
                        })}
                        <div className="p-4">
                           <button sectionsid={sectindex} onClick={(e) => addQuestion(e)} className="h-10 rounded-md shadow-md bg-black text-white flex py-2 px-4 items-center hover:bg-gray-700 hover:text-gray-500">
                              <PlusSmIcon className="w-5 h-5" />
                              <p className=" ml-2">Question</p>
                           </button>
                        </div>
                     </div>
                  );
               })}
            </>
         )}
         {tabIndex === 1 && (
            <>
               {sectionsdata.map((item, sectindex) => {

                  return (
                     <div className="bg-white border border-gray-400 rounded-lg flex flex-col mt-4 overflow-hidden">
                        <div className="bg-gray-100 py-4 px-6 border-b border-b-gray-400">
                           <div className="flex mb-4 items-center">
                              <p className="text-2xl font-semibold flex-1">{`Section ${sectindex + 1}: ${item.category}`}</p>
                           </div>
                        </div>
                        {sectionsQuestionsdata.filter(eq => eq.sectionid == item.id).map((item, index) => {
                           return (
                              <div className="border-b border-b-gray-400 p-4">
                                 <p className="text-xl font-semibold">{`Question ${index + 1}: ${item.question}`}</p>
                                 <div id={`section${sectindex}container${index}`}></div>
                              </div>
                           );
                        })}
                     </div>
                  );
               })}
            </>
         )}
         <UpdateSurveyModal
            show={UpdatemodalShow}
            onHide={() => {
               setModalShow(false);
               LoadSurveyData()
            }}
            id={(params.id)}
         />
      </>
   );
}

export default SurveyDetails;
