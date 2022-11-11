import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRightIcon, UserIcon, CurrencyDollarIcon, GlobeAltIcon, ChevronRightIcon, PlusSmIcon, TrashIcon, PencilIcon } from "@heroicons/react/solid";
import { formatDistance } from 'date-fns'
import Form from 'react-bootstrap/Form';

import CreateSurveyModal from '../components/modal/CrateSurvey'

import UpdateTrialModal from '../components/modal/UpdateTrial'

function TrialDetails() {
   const params = useParams();
   const navigate = useNavigate();
   const [tabIndex, setTabIndex] = useState(0);
   const [UpdatemodalShow, setModalShow] = useState(false);
   const [CreateSurveymodalShow, setSurveyModalShow] = useState(false);

   const [audiences, setAudiences] = useState([
      {
         id: 'a',
         AgeMin: '35',
         AgeMax: '40',
         Race: 'asian',
         Gender: 'male',
      },
   ]);

   const [data, setData] = useState([]);
   const [contributors, setContributors] = useState([]);

   const [TRIAL_DATA, setTRIAL_DATA] = useState({})
   const [REWARD_DATA, setREWARD_DATA] = useState({})

   const TABS = [
      {
         id: 'surveys',
         title: 'Surveys',
      },
      {
         id: 'contributors',
         title: 'Contributors',
      },
      {
         id: 'settings',
         title: 'Settings',
      },
   ];

   const TABLE_COLS = [
      {
         id: 'name',
         title: 'Name',
      },
      {
         id: 'question',
         title: 'Question',
      },
      {
         id: 'reward',
         title: 'Reward',
      },
      {
         id: 'submission',
         title: 'Submission',
      },
      {
         id: 'last submission',
         title: 'Last submission',
      }
   ];

   const CONTRIBUTORs_COLS = [
      {
         id: 'name',
         title: 'Name',
      },
      {
         id: 'age',
         title: 'Age',
      },
      {
         id: 'race',
         title: 'Race',
      },
      {
         id: 'gender',
         title: 'Gender',
      },
      {
         id: 'disease',
         title: 'Disease',
      }
      ,
      {
         id: 'joined',
         title: 'Joined',
      }
   ];

   const AUDIENCES_COLS = [
      {
         id: 'age_minimum',
         title: 'Age minimum',
      },
      {
         id: 'age_maximum',
         title: 'Age maximum',
      },
      {
         id: 'race',
         title: 'Race',
      },
      {
         id: 'gender',
         title: 'Gender',
      },
   ];
   function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
   }
   const addSurvey = () => {
      setSurveyModalShow(true);
   };

   const addAudiance = async () => {

      await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/CreateAudience?TrialidTXT=${(params.id)}`, {
         "headers": {
            "accept-language": "en-US,en;q=0.9",
            "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
         },
         "body": null,
         "method": "GET"
      }).then(e => { return e.json() }).then(e2 => {

         setAudiences(prevState => [...prevState, {
            id: e2.results[0].ID,
            ageMin: '',
            ageMax: '',
            race: '',
            gender: '',
         }])
      })

   };
   async function UpdateAudiences(event) {
      var audienceSave = document.getElementById("audienceSave")
      audienceSave.classList.remove("hover:bg-gray-600")
      audienceSave.classList.remove("bg-black")
      audienceSave.classList.add("bg-gray-400")
      audienceSave.classList.add("cursor-default")

      event.target.disabled = true;
      var done = new Promise(async (resolve, reject) => {
         await audiences.forEach(async (element) => {
            const textUpdate = `updateAudience?idTXT=${parseInt(element.id)}&AgeMinTXT=${Number(element.AgeMin)}&AgeMaxTXT=${Number(element.AgeMax)}&RaceTXT=${encodeURIComponent(element.Race)}&GenderTXT=${encodeURIComponent(element.Gender)}`
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
               })
            });
            await waitUpdate;
         });
         resolve(audiences);

      })
      await done
      console.log("done")
      event.target.disabled = false;
      audienceSave.classList.add("hover:bg-gray-600")
      audienceSave.classList.add("bg-black")
      audienceSave.classList.remove("bg-gray-400")
      audienceSave.classList.remove("cursor-default")
   };
   async function UpdateRewarads(event) {
      event.preventDefault();
      const { rewardselect, rewardprice, totalspendlimit } = event.target;

      var rewardsSave = document.getElementById("rewardsSave")
      rewardsSave.classList.remove("hover:bg-gray-600")
      rewardsSave.classList.remove("bg-black")
      rewardsSave.classList.add("bg-gray-400")
      rewardsSave.classList.add("cursor-default")

      rewardsSave.disabled = true;
      var done = new Promise(async (resolve, reject) => {
         const textUpdate = `saveReward?TrialidTXT=${parseInt(params.id)}&rewardtypeTXT=${rewardselect.value}&rewardpriceTXT=${Number(rewardprice.value.replace("$", ""))}&totalSpendingLimitTXT=${parseInt(totalspendlimit.value.replace("$", ""))}`
         var waitUpdate = new Promise(async (resolve2, reject) => {
            await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/${textUpdate}`, {
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
         await waitUpdate;
      })
      await done
      console.log("done")
      rewardsSave.disabled = false;
      rewardsSave.classList.add("hover:bg-gray-600")
      rewardsSave.classList.add("bg-black")
      rewardsSave.classList.remove("bg-gray-400")
      rewardsSave.classList.remove("cursor-default")
   };

   async function removeElementFromArray(all, specific, seting) {
      seting([])
      var done = new Promise(async (resolve, reject) => {
         const textDelete = `DeleteAudience?idTXT=${parseInt(all[specific].id)}`
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
      })
      await done
      var storing = [];
      for (let index = 0; index < all.length; index++) {
         const element = all[index];
         if (index == specific) {
            continue
         }
         storing.push(element)
      }

      seting(storing)

      console.log("done")
   }
   async function LoadData() {
      setTRIAL_DATA({})
      await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/GetTrial?idTXT=${parseInt(params.id)}`, {
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

      })
   }
   async function LoadDataSurvey() {
      setData([])
      sleep(10)
      await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/SelectSurveyByTrialid?TrialidTXT=${parseInt(params.id)}`, {
         "headers": {
            "accept-language": "en-US,en;q=0.9",
            "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
         },
         "body": null,
         "method": "GET"
      }).then(e => {
         return e.json();
      }).then(e => {
         e.results[0].SV.forEach(element => {

            setData(prevState => [...prevState, element.attributes]);
         });
         console.log(data)
      })
   }

   async function LoadAudiences() {
      setAudiences([])
      await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/LoadAudience?TrialidTXT=${parseInt(params.id)}`, {
         "headers": {
            "accept-language": "en-US,en;q=0.9",
            "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
         },
         "body": null,
         "method": "GET"
      }).then(e => {
         return e.json();
      }).then(e => {
         e.results[0].SV.forEach(element => {
            var NewAudience = {
               "id": element.v_id,
               ...element.attributes
            }
            setAudiences(prevState => [...prevState, NewAudience]);
         });
      })
      console.log("Audiences =>", audiences)
   }
   async function LoadRewards() {
      setREWARD_DATA({})
      var done = new Promise(async (resolve, reject) => {
       await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/GetRewards?idTXT=${parseInt(params.id)}`, {
            "headers": {
               "accept-language": "en-US,en;q=0.9",
               "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
            },
            "body": null,
            "method": "GET"
         }).then(e => {
            return e.json();
         }).then(e => {
            setREWARD_DATA(e.results[0]['(SV)'][0].attributes);
            console.log("Rewards =>", REWARD_DATA)
             resolve(REWARD_DATA);
         })
      })
      await done
     
   }
   async function LoadDataContributors() {
      setContributors([])
      sleep(10)
      await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/getContributors?TrialidTXT=${parseInt(params.id)}`, {
         "headers": {
            "accept-language": "en-US,en;q=0.9",
            "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
         },
         "body": null,
         "method": "GET"
      }).then(e => {
         return e.json();
      }).then(e => {
         e.results[0].SV.forEach(element => {
            setContributors(prevState => [...prevState, element.attributes]);
         });
         console.log(data)
      })
   }

   async function deleteTrial() {
      var Delete = new Promise(async (resolve, reject) => {
         const textDelete = `DeleteTrial?TrialidTXT=${parseInt(params.id)}`;
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
      await Delete
      navigate("/trials", { replace: true })
   }

   useEffect(async () => {
      LoadData();
   }, [])

   useEffect(async () => {
      if (tabIndex == 0) {
         LoadDataSurvey();

      } else if (tabIndex == 2) {
         LoadRewards()
         LoadAudiences();
      } else {
         LoadDataContributors();
      }
   }, [tabIndex])
   return (
      <>
         <div className="bg-white border border-gray-400 rounded-lg py-4 px-6 flex mb-2 items-center">
            <div onClick={() => navigate(-1)} className="flex items-center hover:cursor-pointer hover:underline decoration-gray-400">
               <p className="text-gray-400">Trials</p>
               <ChevronRightIcon className="mx-1 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center">
               <p className="text-gray-400">{TRIAL_DATA?.title}</p>
            </div>
         </div>
         <div className={`bg-white border border-gray-400 rounded-lg overflow-hidden mb-2`}>
            <div className="flex p-6">
               <img src={TRIAL_DATA?.image} alt="Trial" className="object-cover max-w-xs" />
               <div className="mx-8 flex-1">
                  <p className="text-3xl font-semibold">{TRIAL_DATA?.title}</p>
                  <p className="mt-6">{TRIAL_DATA?.description}</p>
               </div>
               <button onClick={() => { setModalShow(true) }} className="flex w-[52px] h-10 border border-gray-400 bg-gray-200 rounded-md justify-center items-center">
                  <PencilIcon className="w-5 h-5 text-gray-400" />
               </button>
            </div>
            <div className="flex p-6 border-t border-t-gray-400 bg-gray-200">
               <div className="flex items-center">
                  <UserIcon className="w-5 h-5 text-gray-500" />
                  <p className="text-gray-500 font-semibold ml-1">{`${TRIAL_DATA?.contributors} contributor(s)`}</p>
               </div>
               <div className="flex items-center ml-6">
                  <GlobeAltIcon className="w-5 h-5 text-gray-500" />
                  <p className="text-gray-500 font-semibold ml-1">{`${TRIAL_DATA?.audience} contributor(s)`}</p>
               </div>
               <div className="flex items-center ml-6">
                  <CurrencyDollarIcon className="w-5 h-5 text-gray-500" />
                  <p className="text-gray-500 font-semibold ml-1">{`Budget of $${TRIAL_DATA?.budget}`}</p>
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
            <div className="bg-white border border-gray-400 rounded-lg py-4 px-6 flex flex-col mt-4">
               <div className="flex items-center">
                  <h2 className="text-2xl font-semibold flex-1">Surveys</h2>
                  <button onClick={addSurvey} className="h-10 rounded-md shadow-md bg-black text-white flex py-2 px-4 items-center">
                     <PlusSmIcon className="w-5 h-5 text-white" />
                     <p className="text-white ml-2">Survey</p>
                  </button>
               </div>
               <table className="table-fixed">
                  <thead className="border-b border-b-gray-400">
                     <tr>
                        {TABLE_COLS.map(({ id, title }) => {
                           return (
                              <th key={id} className="text-left font-normal py-3 px-3">{title}</th>
                           );
                        })}
                        <th className="py-3 px-3" />
                     </tr>
                  </thead>
                  <tbody>
                     {data.map(({ id, name, question, reward, submission, Lastsubmission, image }, index) => {
                        const IS_LAST = index === data.length - 1;
                        return (
                           <tr className={`border-b-gray-400 ${!IS_LAST ? 'border-b' : 'border-0'}`}>
                              <td className="py-3 px-3">
                                 <div style={{ display: "flex", alignItems: "center" }}>
                                    <img src={image} style={{ width: 50, height: 50, borderRadius: 5 }} />
                                    <span style={{ paddingLeft: 15 }}>{name}</span>
                                 </div>
                              </td>
                              <td className="py-3 px-3">{question}</td>
                              <td className="py-3 px-3">{`$${reward}`}</td>
                              <td className="py-3 px-3">{`${submission}/24`}</td>
                              <td className="py-3 px-3">{Lastsubmission ? formatDistance(new Date(Lastsubmission), new Date(), { addSuffix: true }) : '-'}</td>
                              <td className="flex justify-end py-3">
                                 <button onClick={() => navigate(`/trials/${TRIAL_DATA.id}/survey/${id}`, { state: { trialID: TRIAL_DATA.id } })} className="flex w-[52px] h-10 border border-gray-400 bg-gray-200 rounded-md justify-center items-center hover:bg-white">
                                    <ArrowRightIcon className="w-5 h-5 text-gray-400 " />
                                 </button>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         )}
         {tabIndex === 1 && (
            <>    <div className="bg-white border border-gray-400 rounded-lg py-4 px-6 flex flex-col mt-4">
               <div className="flex items-center">
                  <h2 className="text-2xl font-semibold flex-1">Contributors</h2>

               </div>
               <table className="table-fixed">
                  <thead className="border-b border-b-gray-400">
                     <tr>
                        {CONTRIBUTORs_COLS.map(({ id, title }) => {
                           return (
                              <th key={id} className="text-left font-normal py-3 px-3">{title}</th>
                           );
                        })}
                        <th className="py-3 px-3" />
                     </tr>
                  </thead>
                  <tbody>
                     {contributors.map(({ id, name, question, reward, submission, Lastsubmission, image }, index) => {
                        const IS_LAST = index === data.length - 1;
                        return (
                           <tr key={id} className={`border-b-gray-400 ${!IS_LAST ? 'border-b' : 'border-0'}`}>
                              <td key={id} className="py-3 px-3">
                                 <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ padding: '13px', background: '#f3f4f6', borderRadius: '4px' }}>
                                       <UserIcon className="w-5 h-5 text-gray-700" />
                                    </div>
                                    <span style={{ paddingLeft: 15 }}>{name}</span>
                                 </div>

                              </td>
                              <td className="py-3 px-3">{question}</td>
                              <td className="py-3 px-3">{`$${reward}`}</td>
                              <td className="py-3 px-3">{`${submission}/24`}</td>
                              <td className="py-3 px-3">{Lastsubmission ? formatDistance(new Date(Lastsubmission), new Date(), { addSuffix: true }) : '-'}</td>
                              <td className="flex justify-end py-3">
                                 <button onClick={() => navigate(`/trials/${TRIAL_DATA.id}/survey/${id}`, { state: { trialID: TRIAL_DATA.id } })} className="flex w-[52px] h-10 border border-gray-400 bg-gray-200 rounded-md justify-center items-center">
                                    <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                                 </button>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
            </>
         )}
         {tabIndex === 2 && (
            <>
               <Form onSubmit={UpdateRewarads} className="bg-white border border-gray-400 rounded-lg py-4 px-6 flex flex-col mt-4">
                  <div className="flex flex-col">
                     <h2 className="text-2xl font-semibold flex-1">Reward</h2>
                     <div>
                        <h4 >Reward per survey</h4>
                        <div className="flex gap-8 items-center ">
                           <select name='rewardselect'  defaultValue={REWARD_DATA.rewardtype ? (REWARD_DATA.rewardtype) : ("")} id='rewardselect' className="mt-1 h-10 px-2 rounded-md border border-gray-200 outline-none w-6/12">
                              <option value="">Select a reward</option>
                              <option  value="Cash">Cash</option>
                           </select>
                           <label className="flex flex-col font-semibold mt-1 w-6/12">
                              <input type="text" defaultValue={REWARD_DATA.rewardprice ? (`$${REWARD_DATA.rewardprice}`) : ("$0")} id="rewardprice" name="rewardprice" className="mt-1 h-10 border border-gray-200 rounded-md outline-none px-2 focus:border-gray-400 " placeholder="$0" />
                           </label>
                        </div>
                     </div>
                     <div>
                        <h4 >Total spending limit</h4>
                        <div className="flex gap-8 justify-between items-center ">
                           <label style={{ width: '47%' }} className="flex flex-col font-semibold mt-1">
                              <input type="text" defaultValue={REWARD_DATA.totalSpendingLimit ? (`$${REWARD_DATA.totalSpendingLimit}`) : ("$0")} id="totalspendlimit" name="totalspendlimit" className="mt-1 h-10 border border-gray-200 rounded-md outline-none px-2 focus:border-gray-400 " placeholder="$0" />
                           </label>
                           <button type="submit" id="rewardsSave" className="h-10 rounded-md shadow-md bg-black text-white flex py-2 px-4 items-center hover:bg-gray-600" >
                              <p className="text-white ml-1">Save</p>
                           </button>
                        </div>
                     </div>

                  </div>
               </Form>
               <div className="bg-white border border-gray-400 rounded-lg py-4 px-6 flex flex-col mt-4">
                  <div className="flex items-center">
                     <h2 className="text-2xl font-semibold flex-1">Audiences</h2>
                     <button onClick={() => addAudiance()} className="h-10 rounded-md shadow-md bg-black text-white flex py-2 px-4 items-center hover:bg-gray-600">
                        <PlusSmIcon className="w-5 h-5 text-white" />
                        <p className="text-white ml-2">Audience</p>
                     </button>
                  </div>
                  <table className="table-fixed">
                     <thead className="border-b border-b-gray-400">
                        <tr>
                           <th className="py-3 px-3">#</th>
                           {AUDIENCES_COLS.map(({ id, title }) => {
                              return (
                                 <th key={id} className="text-left font-normal py-3 px-3">{title}</th>
                              );
                           })}
                           <th className="py-3 px-3" />
                        </tr>
                     </thead>
                     <tbody>
                        {audiences.map((item, index) => {
                           const IS_LAST = index === audiences.length - 1;
                           return (
                              <tr className={`border-b-gray-400 ${!IS_LAST ? 'border-b' : 'border-0'}`}>
                                 <td className="flex py-3 px-3 items-center h-[72.5px]">{index + 1}</td>
                                 <td className="py-3 px-3">
                                    <input type="text" id="age-min" onChange={(e) => { audiences[index].AgeMin = e.target.value }} name="age-min" defaultValue={item.AgeMin} className="mt-2 h-10 border border-gray-200 rounded-md outline-none px-2 focus:border-gray-400" />
                                 </td>
                                 <td className="py-3 px-3">
                                    <input type="text" id="age-max" name="age-max" onChange={(e) => { audiences[index].AgeMax = e.target.value }} defaultValue={item.AgeMax} className="mt-2 h-10 border border-gray-200 rounded-md outline-none px-2 focus:border-gray-400" />
                                 </td>
                                 <td className="py-3 px-3">
                                    <select name={`race${index}`} id={`race-select${index}`} onChange={(e) => { audiences[index].Race = e.target.value }} className="h-10 px-1 rounded-md border border-gray-200 outline-none w-full" defaultValue={item.Race}>
                                       <option value="">Select a race</option>
                                       <option value="asian">Asian</option>
                                       <option value="asian">African America</option>
                                       <option value="american-indian">American Indian</option>
                                       <option value="black">Black</option>
                                       <option value="hispanic">Hispanic</option>
                                       <option value="native-hawaiian">Native Hawaiian</option>
                                       <option value="white">White</option>
                                    </select>
                                 </td>
                                 <td className="py-3 px-3">
                                    <select name={`gender${index}`} id={`gender-select${index}`} onChange={(e) => { audiences[index].Gender = e.target.value }} className="h-10 px-1 rounded-md border border-gray-200 outline-none w-full" defaultValue={item.Gender}>
                                       <option value="">Select a gender</option>
                                       <option value="male">Male</option>
                                       <option value="female">Female</option>
                                       <option value="everyone">Everyone</option>
                                    </select>
                                 </td>
                                 <td className="flex justify-end items-center h-[72.5px] py-3">
                                    <button onClick={(e) => { removeElementFromArray(audiences, index, setAudiences) }} className="flex w-[52px] h-10 border border-gray-400 bg-gray-200 rounded-md justify-center items-center hover:bg-white">
                                       <TrashIcon className="w-5 h-5 text-gray-400" />
                                    </button>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>

                  </table>
                  <div className="flex mt-1 items-center">
                     <h2 className="text-2xl font-semibold flex-1"></h2>
                     <button id="audienceSave" className="h-10 rounded-md shadow-md bg-black text-white flex py-2 px-4 items-center hover:bg-gray-600" onClick={UpdateAudiences}>
                        <p className="text-white ml-1">Save</p>
                     </button>
                  </div>
               </div>
               <div className="bg-white border border-gray-400 rounded-lg py-4 px-6 flex flex-col mt-4">
                  <h2 className="text-2xl font-semibold mb-4">Delete</h2>
                  <p>Deleting the trial will delete all surveys and the collected data. Contributors will no longer be able to take any of the surveys.</p>
                  <button className="mt-4 flex self-start px-2 h-10 border border-gray-400 bg-gray-200 rounded-md justify-center items-center text-gray-400 hover:bg-white hover:text-red-700" onClick={deleteTrial}>
                     <TrashIcon className="w-5 h-5 mr-2" />Delete
                  </button>
               </div>
            </>
         )}
         <UpdateTrialModal
            show={UpdatemodalShow}
            onHide={() => {
               setModalShow(false);
               LoadData()
            }}
            id={(params.id)}
         />
         <CreateSurveyModal
            show={CreateSurveymodalShow}
            onHide={() => {
               setSurveyModalShow(false);
               LoadDataSurvey();
            }}
            Tiralid={params.id}
         />
      </>
   );
}

export default TrialDetails;
