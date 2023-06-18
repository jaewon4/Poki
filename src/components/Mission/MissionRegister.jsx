import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { missionCreate } from "../../api/mission.ts";
import MissionRegisterModal  from "../Modal/MissionRegisterModal.jsx";
export default function MissionRegister() {
  const [missionContent, setMissionContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const queryClient = useQueryClient();

  const handleInputChange = (e) => {
    setMissionContent(e.target.value);
  };

  const handleButtonClick = () => {
    if (missionContent === '') {
      setModalMessage('fail');
      setShowModal(true);
    } else {
      setModalMessage('success');
      handleMissionCreate();
      setShowModal(true);
    }
    showModal && <MissionRegisterModal onClose={closeModal} text={modalMessage} />
  };
  

  const closeModal = () => {
    setShowModal(false);
  };

  const mutation = useMutation((params) => missionCreate(params), {

    onSuccess: (data) => {
      console.log("서버 응답:", data);
    },
    onError: (error) => {
      console.error("미션 생성 실패:", error);
    },
    onSettled: () => {
      setMissionContent("");
      queryClient.invalidateQueries("missions");
    },
  });

  const handleMissionCreate = async () => {
    try {
      var date = new Date();
      const createdDate =
      date.getFullYear().toString() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString();
      
      const params = {
        request: {
          "content": missionContent,
          "created_date": createdDate,
          "completed_date": createdDate,
        },
      };

    mutation.mutate(params);
    } catch (error) {
      console.log("등록 실패:", error);
    }
  };

  return (
    <>
      <h3 className="text-xl font-bold mb-4">미션 등록</h3>
      <div className="w-full lg:col-span-5 lg:pt-2">
        <div className="flex gap-x-4">
          <input
            id="code"
            name="code"
            type="text"
            value={missionContent}
            onChange={handleInputChange}
            className="min-w-0 flex-auto rounded-md border-0 px-3.5 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
            placeholder="미션 입력"
          />

          <button
            className="block rounded-md bg-blue-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick= {handleButtonClick}
          >
            미션 등록
          </button>
        </div>
      </div>
    </>
  );
}
