import { useState, useEffect, useRef } from 'react';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';

export default function Description({ data }:{data:any}) {
  const [show, setShow] = useState(false);
  
  return (
    <div className="min-w-full w-fit mx-auto p-2 mb-3 bg-gray-100 rounded-lg">
      <h2 className="text-lg ml-2 font-bold mb-2 inline-block">Description</h2>
      <div onClick={()=>{
        setShow((prev:any)=>!prev)
      }} className=" inline-block m-2 float-right">
        {(show)?<FaMinusCircle/>:<FaPlusCircle/>}
      </div>
      
      <div className={(show)?'':"hidden"}>
      <div className="max-h-[300px] break-all overflow-scroll">{data}</div>

      </div>
    </div>
  );
}
