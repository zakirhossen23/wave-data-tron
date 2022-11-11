import { PlusSmIcon, ArrowRightIcon, UserIcon, CurrencyDollarIcon, GlobeAltIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DUMMY_TRIALS_DATA } from "./data";
import CreateTrialModal from '../components/modal/CrateTrial'

function Trials() {
   const navigate = useNavigate();
   const [data, setData] = useState([]);
   const [CreatemodalShow, setModalShow] = useState(false);
   const [startData, setStartData] = useState(0);
   const addTrial = () => {

      // setData(prevState => [...prevState, newTrial]);
      setModalShow(true);
   };


   async function LoadData() {
      setData([])
      await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/SelectTrial?offsetINT=${startData}`, {
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
            var newTrial = {
               "id":element.v_id,
               ...element.attributes
            }
            setData(prevState => [...prevState, newTrial]);
         });
   
      })
   }

   useEffect(async() => {
    await  LoadData();
   }, [])


   return (
      <>
         <div className="bg-white border border-gray-400 rounded-lg py-4 px-6 flex mb-2 items-center">
            <h1 className="text-2xl font-semibold flex-1 text-gray-500">Medical trials</h1>
            <button onClick={addTrial} className="h-10 rounded-md shadow-md bg-black text-white flex py-2 px-4 items-center">
               <PlusSmIcon className="w-5 h-5 text-white" />
               <p className="text-white ml-2">Trial</p>
            </button>
         </div>
         {data.map(({ id, title, image, description, contributors, audience, budget }, index) => {
            const IS_LAST = index + 1 === data.length;
            return (               
               <div className={`bg-white border border-gray-400 rounded-lg overflow-hidden ${!IS_LAST && 'mb-2'}`}>
                  <div className="flex p-6">
                     <img src={image} alt="Trial" className="w-[128px] h-[128px] object-cover max-w-xs" />
                     <div className="mx-8 flex-1">
                        <p className="text-3xl font-semibold">{title}</p>
                        <p className="mt-6">{`${description.slice(0, 180)}...`}</p>
                     </div>
                     <button onClick={() => navigate(`/trials/${id}`)} className="flex w-[52px] h-10 border border-gray-400 bg-gray-200 rounded-md justify-center items-center">
                        <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                     </button>
                  </div>
                  <div className="flex p-6 border-t border-t-gray-400 bg-gray-200">
                     <div className="flex items-center">
                        <UserIcon className="w-5 h-5 text-gray-500" />
                        <p className="text-gray-500 font-semibold ml-1">{`${contributors} contributor(s)`}</p>
                     </div>
                     <div className="flex items-center ml-6">
                        <GlobeAltIcon className="w-5 h-5 text-gray-500" />
                        <p className="text-gray-500 font-semibold ml-1">{`${audience} contributor(s)`}</p>
                     </div>
                     <div className="flex items-center ml-6">
                        <CurrencyDollarIcon className="w-5 h-5 text-gray-500" />
                        <p className="text-gray-500 font-semibold ml-1">{`Budget of $${budget}`}</p>
                     </div>
                  </div>
               </div>
            );
         })}
         <CreateTrialModal
            show={CreatemodalShow}
            onHide={() => {
               setModalShow(false);
               LoadData()
            }}
         />
      </>
   );
}

export default Trials;
