import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import ReportModel from "./ReportModel";
import { getToken } from "../../../utils/handelCookie";
import { getDataUserById } from "../../../redux/userSlice/authActions";
import { getDataUserWithWareHouseDataById } from "../../../redux/getDataProjectById/getActions";
import { getAllWarehouse } from "../../../redux/wharHosueState/WareHouseAction";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BackendUrl } from "../../../redux/api/axios";
import { toast } from "react-toastify";
import { getRoleAndUserId } from "../../../redux/RoleSlice/rolAction";
import { hasPermission } from "../../../utils/Function";
import DashboardWarehouse from "../Dashbord";
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
}));
const inventoryData = [
  { name: "مخزن أطارات", value: 300 },
  { name: "أثاث", value: 200 },
  { name: "ممحزن موا أحتياطية", value: 150 },
  { name: "مخزن مواد اولية", value: 250 },
];

const monthlyData = [
  { month: "يناير", sales: 4000, purchases: 2400 },
  { month: "فبراير", sales: 3000, purchases: 1398 },
  { month: "مارس", sales: 2000, purchases: 9800 },
  { month: "أبريل", sales: 2780, purchases: 3908 },
  { month: "مايو", sales: 1890, purchases: 4800 },
  { month: "يونيو", sales: 2390, purchases: 3800 },
];

const warehouseUsage = [
  { name: " مخزن السيارات", used: 75, total: 100 },
  { name: "مخزن الاسمنت", used: 60, total: 100 },
  { name: "مخزن الاطارات", used: 85, total: 100 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const WarehouseReport = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [labData, setLabData] = useState([]);
  const [factoryData, setFactoryData] = useState([]);
  const token = getToken();
  const [permissionData, setPermissionData] = useState([]);

  const dispatch = useDispatch();
  const { wareHouseData } = useSelector((state) => state.wareHouse);
  const { dataUserById } = useSelector((state) => state.user);
  const { dataUserLab } = useSelector((state) => state?.dataHandelUserAction);
  const { Permission, roles } = useSelector((state) => state?.RolesData);
  const [wareHouseDataEntityId, setWareHouseData] = useState([]);

  useEffect(() => {
    const userId = dataUserById?.user_id;
    if (userId) {
      dispatch(getRoleAndUserId({ token, userId }));
    }
  }, [dispatch, dataUserById?.user_id, token]);
  useEffect(() => {
    if (Permission?.permission_id) {
      try {
        setPermissionData(JSON.parse(Permission.permission_id));
      } catch (error) {
        console.error("Error parsing permission_id:", error);
      }
    }
  }, [Permission]);
  useEffect(() => {
    const fetchDataByProjectId = async () => {
      try {
        setLoading(true);
        const [labResponse, FactoriesResponse, WareHouseDataId] =
          await Promise.all([
            axios.get(
              `${BackendUrl}/api/warehouse/getLabDataByEntity_id?entity_id=${dataUserById?.entity_id}`,
              {
                headers: { authorization: token },
              }
            ),
            axios.get(
              `${BackendUrl}/api/warehouse/getFactoryAndUserData?entity_id=${dataUserById?.entity_id}`,
              {
                headers: { authorization: token },
              }
            ),
            axios.get(
              `${BackendUrl}/api/warehouse/getWarehouseDataByEntity_id?entity_id=${dataUserById?.entity_id}`,
              {
                headers: { authorization: token },
              }
            ),
          ]);
        if (labResponse?.data) {
          console.log(labResponse?.data);
          setLabData(labResponse?.data?.data);
        }
        if (FactoriesResponse?.data) {
          console.log(FactoriesResponse?.data);
          setFactoryData(FactoriesResponse?.data?.data);
        }
        if (WareHouseDataId?.data) {
          hasPermission(roles?.allow_to_see_reports?._id, permissionData)
            ? setWareHouseData(WareHouseDataId?.data?.data)
            : setWareHouseData(wareHouseData);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDataByProjectId();
  }, [dataUserById, token]);
  useEffect(() => {
    const fetchInitialData = async () => {
      await dispatch(getDataUserById(token));
    };
    fetchInitialData();
  }, [dispatch, token, refresh]);

  useEffect(() => {
    if (dataUserById?.user_id && dataUserById?.entity_id) {
      const { user_id, entity_id } = dataUserById;
      dispatch(getDataUserWithWareHouseDataById({ user_id, entity_id }));
    }
  }, [dataUserById, dispatch]);

  useEffect(() => {
    if (dataUserById && dataUserLab) {
      const { entity_id } = dataUserById;
      const { factory_id, lab_id } = dataUserLab;
      if (factory_id && lab_id) {
        dispatch(getAllWarehouse({ entity_id, lab_id, factory_id }));
      }
    }
  }, [dataUserById, dataUserLab, dispatch]);
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <ReportModel
          reportEntity="المخزون"
          entity_id={dataUserById?.entity_id}
          user_id={dataUserById?.user_id}
          wareHouseData={wareHouseData}
          labData={labData}
          factoryData={factoryData}
          permissionData={permissionData}
          roles={roles}
        />

        <Typography variant="h5" component="h2" gutterBottom>
          تقارير المخزون والمبيعات
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="time-range-label">الفترة الزمنية</InputLabel>
          <Select
            labelId="time-range-label"
            value={timeRange}
            label="الفترة الزمنية"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">أسبوع</MenuItem>
            <MenuItem value="month">شهر</MenuItem>
            <MenuItem value="quarter">ربع سنوي</MenuItem>
            <MenuItem value="year">سنة</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {hasPermission(roles?.allow_to_see_reports?._id, permissionData) && (
        <DashboardWarehouse />
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={3}>
            <Typography variant="h6" gutterBottom align="right">
              توزيع المخزون حسب الفئة
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {inventoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </StyledPaper>
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <StyledPaper elevation={3}>
            <Typography variant="h6" gutterBottom align="right">
              استخدام المستودعات
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={warehouseUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="used"
                  name="المساحة المستخدمة"
                  fill="#8884d8"
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </StyledPaper>
        </Grid> */}

        {/* <Grid item xs={12}>
          <StyledPaper elevation={3}>
            <Typography variant="h6" gutterBottom align="right">
              المبيعات والمشتريات الشهرية
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  name="المبيعات"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="purchases"
                  name="المشتريات"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </StyledPaper>
        </Grid> */}
        {/* 
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={3}>
            <Typography variant="h6" gutterBottom align="right">
              ملخص الأداء
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h4" align="center" color="primary">
                  85%
                </Typography>
                <Typography variant="body1" align="center">
                  كفاءة المخزون
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h4" align="center" color="secondary">
                  92%
                </Typography>
                <Typography variant="body1" align="center">
                  دقة التسليم
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h4" align="center" color="success.main">
                  78%
                </Typography>
                <Typography variant="body1" align="center">
                  استغلال المساحة
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h4" align="center" color="warning.main">
                  95%
                </Typography>
                <Typography variant="body1" align="center">
                  رضا العملاء
                </Typography>
              </Grid>
            </Grid>
          </StyledPaper>
        </Grid> */}
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={3} sx={{ width: "100%" }}>
            <Typography variant="h6" gutterBottom align="right">
              التنبيهات والإشعارات
            </Typography>
            <Box sx={{ mt: 2, width: "100%" }}>
              <Typography
                variant="body1"
                color="error"
                sx={{ mb: 1 }}
                align="right"
              >
                5 منتجات وصلت للحد الأدنى للمخزون •
              </Typography>
              <Typography
                variant="body1"
                color="warning.main"
                sx={{ mb: 1 }}
                align="right"
              >
                3 شحنات متأخرة عن موعد التسليم •
              </Typography>
              <Typography
                variant="body1"
                color="info.main"
                sx={{ mb: 1 }}
                align="right"
              >
                8 طلبات جديدة تحتاج للمعالجة •
              </Typography>
              <Typography variant="body1" color="success.main" align="right">
                تم اكتمال 12 شحنة بنجاح اليوم •
              </Typography>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WarehouseReport;
