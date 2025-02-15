import * as React from "react";
import { Box, IconButton } from "@mui/material";
import CustomeSelectField from "../../../components/CustomeSelectField";
import { Close } from "@mui/icons-material";
import { BottomSend } from "../../../utils/Content";
import { toast } from "react-toastify";
import { BackendUrl } from "../../../redux/api/axios";
import axios from "axios";
import { getToken } from "../../../utils/handelCookie";
export default function FilterData({
  dataMainClass,
  dataSubClass,
  open,
  setOpen,
  page,
  limit,
  setFilterDataMainClass,
  setRefreshButton,
  setTotalItems,
  setTotalPages,
  dataUserById,
}) {
  const [mainClass, setMainClass] = React.useState("");
  const [subClass, setSubClass] = React.useState("");
  const [filteredSubClasses, setFilteredSubClasses] = React.useState([]);
  const handleClose = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    const filteredData = dataSubClass?.filter((item) => {
      return item?.mainClass_id === mainClass?.mainClass_id;
    });
    setFilteredSubClasses(filteredData);
  }, [mainClass, dataSubClass]);
  const handelSearch = async () => {
    try {
      const response = await axios.get(
        `${BackendUrl}/api/getDataStagnantMaterialsSearch?sub_class=${
          subClass?.subClass_id || ""
        }&mainClass=${mainClass?.mainClass_id}&Entities_id=${
          dataUserById?.entity_id
        }&limit=${limit}&page=${page}`,
        {
          headers: {
            authorization: getToken(),
          },
        }
      );
      if (response && response.data) {
        setFilterDataMainClass(response.data.response); // Update filtered data
        setTotalPages(response?.data?.pagination?.totalPages);
        setTotalItems(response?.data?.pagination?.totalItems);
        setRefreshButton((prv) => !prv);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };
  return (
    <>
      {open && (
        <Box sx={{ mt: "10px" }} className="boxContainerReportFilter">
          <IconButton onClick={handleClose} sx={{ mb: "10px" }}>
            <Close />
          </IconButton>
          <Box>
            <div
              className="d-flex "
              style={{
                gap: "10px",
                width: "100%",
                maxWidth: "100%",
                flexDirection: "column",
              }}
            >
              <CustomeSelectField
                label={"أختيار ألصنف  بالرئيسي "}
                haswidth={true}
                value={mainClass}
                hasMultipleLine={true}
                customPadding={"0px"}
                list={dataMainClass ? dataMainClass : []}
                customGetOptionLabel={(option) => option?.main_Class_name || ""}
                multiple={false}
                required
                readOnly={false}
                onChange={(e, newValue) => {
                  setMainClass(newValue);
                }}
                onClearClick={() => {
                  setMainClass("");
                }}
              />
              <CustomeSelectField
                label={"أختيار ألصنف الفرعي"}
                haswidth={true}
                value={subClass}
                hasMultipleLine={true}
                customPadding={"0px"}
                list={filteredSubClasses ? filteredSubClasses : []}
                customGetOptionLabel={(option) => option?.sub_class_name || ""}
                multiple={false}
                required
                readOnly={false}
                onChange={(e, newValue) => {
                  setSubClass(newValue);
                }}
                onClearClick={() => {
                  setSubClass("");
                }}
              />
            </div>
            <BottomSend sx={{ mt: "10px" }} onClick={handelSearch}>
              بحث
            </BottomSend>
          </Box>
        </Box>
      )}
    </>
  );
}
