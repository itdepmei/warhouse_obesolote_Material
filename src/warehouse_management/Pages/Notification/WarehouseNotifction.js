import * as React from "react";
import Notification from "../../../Notification/Notification";

export default function WarehouseNotification() {
  return (
    <Notification urlApi="warehouse/getNotificationWarehouse"/>
  );
}
