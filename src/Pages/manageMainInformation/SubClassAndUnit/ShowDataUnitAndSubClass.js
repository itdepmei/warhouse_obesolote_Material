import * as React from "react";
import { useState, Fragment } from "react";
import { Button, Dialog, DialogActions, DialogContent,useMediaQuery,useTheme } from "@mui/material";
import Table from "react-bootstrap/Table";
import { ButtonSave } from "../../../utils/Content";
import ModelEdit from "./editDataSubandMeasuring";
import { BackendUrl } from "../../../redux/api/axios";
import axios from "axios";
import { getToken } from "../../../utils/handelCookie";
import AllowDelete from "../../../components/AllowDelete.jsx";
export default function ShowDataSubAndUnit({
  setOpen1,
}) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [dataSubClass, setDataSubClass] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const token = getToken();
  const fetchSubClassData = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataSubClass`, {
        headers: {
          authorization: token,
        },
      });
      setDataSubClass(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };
  React.useEffect(() => {
    fetchSubClassData();
  }, [open, refresh]);
  return (
    <Fragment>
      <ButtonSave onClick={handleClickOpen}> البيانات المدرجة</ButtonSave>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <Table
            striped
            bordered
            hover
            dir="rtl"
            variant={theme?.palette?.mode === "dark" ? "dark" : ""}
          >
            <thead>
              {
                <tr>
                  <th>#</th>
                  <th>أسم الصنف الخاص</th>
                </tr>
              }
            </thead>
            <tbody>
              {dataSubClass?.map((item, index) => (
                <tr key={item?.index}>
                  <td>{index + 1}</td>
                  <td>{item?.sub_class_name}</td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center gap-4">
                      <ModelEdit
                        label="subClass"
                        edit_path={"editSubClass"}
                        edit_id={item?.subClass_id}
                        edit_value={item?.sub_class_name}
                        edit_select={item?.mainClass_id}
                        dataMainClass={dataSubClass}
                        setOpen1={setOpen1}
                        setRefresh={setRefresh}

                      />
                      <AllowDelete
                        delete_id={item?.subClass_id}
                        path_delete={"deleteByIdSubClass"}
                        setRefresh={setRefresh}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            غلق
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
