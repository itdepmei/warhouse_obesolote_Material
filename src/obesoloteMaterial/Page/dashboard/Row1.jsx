import { Paper, Stack, Typography, useTheme } from "@mui/material";
import Card from "./card";
import { data1, data2, data3 } from "./data";
import { useEffect, useState } from "react";
import axios from "axios";
import { BackendUrl } from "../../../redux/api/axios";
import userImage from "../../../assets/image/users.png";
import ministriesImage from "../../../assets/image/government_7408001.png";
import entitiesImage from "../../../assets/image/entrepreneur_1358584.png";
import productImage from "../../../assets/image/boxes_6690949.png";
import productTransaction from "../../../assets/image/transaction.png";

import { getToken } from "utils/handelCookie";

const Row1 = ({ reportEntity,entity_id }) => {
  const [countData, setCountData] = useState(0);
  const [countDataMinistry, setCountDataMinistry] = useState(0);
  const [countDataEntities, setCountDataEntities] = useState(0);
  const [countDataForCurrentMonth, setCountDataForCurrentMonth] = useState(0);
  const [countUser, setCountUser] = useState(0);
  const [totalCountBooked, setTotalCountBooked] = useState(0);

  const [error, setError] = useState(null);
  const fetchReport = async () => {
    try {
      const path=reportEntity?`${BackendUrl}/api/getDataCountOfEntity/${entity_id}`:`${BackendUrl}/api/getDataCountOfMaterial`
      const { data } = await axios.get(path, {
        headers: {
          authorization: getToken()
        }
      });
      setCountData(data?.total_count || 0);
      setCountDataMinistry(data?.totalMinistry || 0);
      setCountDataForCurrentMonth(data?.totalCountMonth || 0);
      setCountDataEntities(data?.totalEntities || 0);
      setCountUser(data?.totalCountUser || 0);
      setTotalCountBooked(data?.totalCountBooked || 0);

    } catch (error) {
      console.error(
        "Error fetching main class data:",
        error?.response?.data?.message || error.message
      );
      setError("Failed to load data");
    }
  };
  useEffect(() => {
    console.log();
    fetchReport();
  }, []);
  const theme = useTheme();
  return (
    <Stack
      direction={"row"}
      flexWrap={"wrap"}
      gap={1}
      justifyContent={{ xs: "center", sm: "space-between",marginBottom: "10px", }}
    >
      {!reportEntity && (
        <Card
          image={userImage}
          subTitle={"عدد المستخدمين"}
          increase={"+14%"}
          data={data1}
          countDataReport={countUser}
          scheme={"nivo"}
        />
      )}
      {!reportEntity && (
        <Card
          image={productImage}
          subTitle={"العدد الكلي للمواد داخل المنصة"}
          increase={"+14%"}
          data={data1}
          scheme={"nivo"}
          countDataReport={countData}
        />
      )}
      <Card
        image={ministriesImage}
        subTitle={"عدد الوزارات و المؤسسات المستقلة  "}
        increase={"+21%"}
        data={data2}
        scheme={"category10"}
        countDataReport={countDataMinistry}
      />
      <Card
        image={entitiesImage}
        subTitle={"الجهات او الدوائر"}
        increase={"+5%"}
        data={data3}
        countDataReport={countDataEntities}
        scheme={"accent"}
      />
      <Card
        image={productImage}
        subTitle={"مواد الشهر الحالي"}
        increase={"+5%"}
        data={data2}
        scheme={"accent"}
        countDataReport={countDataForCurrentMonth}
      />
        <Card
        image={productTransaction}
        subTitle={"عدد الصفقات الكلي"}
        increase={"+5%"}
        data={data3}
        scheme={"accent"}
        countDataReport={totalCountBooked}
      />
    </Stack>
  );
};
export default Row1;
