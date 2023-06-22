import { React, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MissionRegisteredGift from "../../components/Mission/MissionRegisteredGift";
import { getBoardStatus } from "../../api/board.js";
import Grapes from "../../components/UI/Grapes";
import {
  getWishlistByUserId,
  updateWishlistGivenStatus,
} from "../../api/wishlist";

export default function ParentMain() {
  const [grape, setGrape] = useState({});

  const boardQuery = useQuery(["boardState"], () => {
    return getBoardStatus();
  });
  const message = [
    "위시리스트에서 자녀의 선물을 확인해보세요",
    "선물을 고른 후 포도 서비스가 시작됩니다",
  ];


  // 31모으면 눌러서 이벤트 발생해야함 아래꺼
  const updateGiven = async () => {
    if (grape.attached_grapes === 31) {
      const x = await getWishlistByUserId();
      const pickedProduct = x.data.item.filter(
        (item) => item.Picked === "TRUE" && item.Given === "FALSE"
      );
      const pickedItemId = pickedProduct[0].id;
      const params = {
        itemid: pickedItemId,
      };
      console.log("31개를 모아서 GIVEN을 TRUE로 만듬");
      await updateWishlistGivenStatus(params);
      // refetch board state after updating
      boardQuery.refetch();

      // force a page reload
      window.location.reload();
    }
  };

  useEffect(() => {
    if (boardQuery.isSuccess) {
      const fetchedGrape = boardQuery?.data?.data?.grape;
      setGrape(fetchedGrape);
    }
  }, [boardQuery.isSuccess, boardQuery.data]);

  useEffect(() => {
    getBoardStatus();
  }, [grape]);

  return (
    <>
      <div className="flex flex-col">
        {/* 배너 */}
        <div className="bg-white py-1 sm:py-1">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Parent Main
              </h2>
              <p className="mt-2 text-lg leading-8 text-gray-600">
                아이들의 포도 관리 현황을 파악해보세요~
              </p>
            </div>
          </div>
      </div>
        {/* 포도알 보드 */}
        <div className="m-8 p-6 rounded-2xl border-4">
          <Grapes GrapesCount={grape.attached_grapes} />
          {/* <Grapes /> */}
        </div>

        {/* 포도알 관리 현황 */}
        <div className="flex">
          <div className="p-6 rounded-2xl border-4 w-2/4 m-10 border-b border-gray-200">
            <div className="px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                포도알 관리 현황판
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                Personal details and application.
              </p>
            </div>
            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    자녀 포도알
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {grape?.deattached_grapes}개
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    붙인 포도알 개수
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {grape?.attached_grapes}개 / {grape?.blank}개
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          {/* 미션 등록 부분 */}
          <div className="w-2/4 m-10 p-6 rounded-2xl border-4">
            <div className="mx-auto text-center">
              <MissionRegisteredGift />
              {(grape?.attached_grapes === 31 ? true : false) && (
                <button
                  onClick={updateGiven}
                  className="w-25 mt-4 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  선물지급완료
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      </>
  );
}
