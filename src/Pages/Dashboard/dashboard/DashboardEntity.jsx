import React, { useEffect, useState } from "react";
import DashboardInformation from "./dashbordInformation";
import { getDataUserById } from "../../../redux/userSlice/authActions";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../../../utils/handelCookie";

function DashboardEntity() {
  const dispatch = useDispatch();
  const token = getToken();
  const { dataUserById } = useSelector((state) => {
    return state.user;
  });
  useEffect(() => {
    dispatch(getDataUserById(token));
  }, [dispatch]);
  return (
    <div>
      <DashboardInformation
        headerText={`أحصائيات ${dataUserById?.Entities_name}  `}
        reportEntity={true}
        entity_id={dataUserById?.entity_id}
      />
    </div>
  );
}

export default DashboardEntity;
