import * as React from "react";
import Notification from "../../../Notification/Notification";
import { useSelector } from "react-redux";

export default function WarehouseNotification() {
  const { roles } = useSelector((state) => state.RolesData);
  return (
    <Notification
      urlApi="getNotification"
      permission={roles.management_Nonfiction?._id}
      category_id={2}
    />
  );
}
