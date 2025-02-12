import { Button, Checkbox, Dialog, DialogActions, DialogContent, FormControlLabel, FormGroup, useMediaQuery, useTheme } from "@mui/material";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { BackendUrl } from "../../../redux/api/axios";
import { ButtonSave } from "utils/Content";
import { getFileIcon } from "utils/Function";
import { getToken } from "utils/handelCookie";
import ModelEdit from "../editData/editData";
import AllowDelate from "../../../components/AllowDelete";
import { toast } from "react-toastify"
const UserGuidList = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [userGuid, setUserGuid] = useState([]);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [refresh2, setRefresh] = useState(false);
  const [refresh3, setRefresh3] = useState(false);
  const [active, setIsActive] = useState({}); // Store active status as an object

  const { t } = useTranslation();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const token = getToken();

  const fetchUserGuid = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataUserGuid`, {
        headers: {
          authorization: token,
        },
      });
      setUserGuid(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchUserGuid();
  }, [open, refresh2, refresh3]);

  const handleClose = () => {
    setOpen(false);
  };

useEffect(() => {
    // Initialize active checkboxes based on show_guide status
    const initialActiveState = userGuid?.reduce((acc, item) => {
      if (item?.is_show) {
        acc[item?.id] = true;
      } else {
        acc[item?.id] = false;
      }
      return acc;
    }, {});
    setIsActive(initialActiveState);
  }, [userGuid]);

  const handleCheckboxChange = (id) => (event) => {
    const updatedStatus = event.target.checked;
    setIsActive((prevState) => ({
      ...prevState,
      [id]: updatedStatus,
    }));
  };

  const EditAccessTOfile = async () => {
    try {
      const accessData = Object?.entries(active)?.map(([id, status]) => ({
        id,
        show_guide: status ? 1 : 0, // Convert boolean to 1 (true) or 0 (false)
      }));
      
      const response = await axios.post(
        `${BackendUrl}/api/EditAccessTOfile`,
        { data:accessData }, // Send the updated data
        {
          headers: {
            authorization: token,
          },
        }
      );
      if (response.status === 200) {
        toast(response?.data?.message);
        setRefresh((prev) => !prev); // Trigger re-fetch if needed
        handleClose();
      }
    } catch (error) {
      console.error("Error updating access:", error?.response?.data?.message);
    }
  };

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
            variant={`${theme?.palette?.mode === "dark" ? "dark" : ""}`}
          >
            <thead>
              <tr>
                <th>#</th>
                <th>الوصف</th>
                <th> الملفات</th>
                <th>{t("Action")}</th>
                <th>حق الوصول</th>
              </tr>
            </thead>
            <tbody>
              {userGuid?.map((item, index) => (
                <tr key={item?.id}>
                  <td>{index + 1}</td>
                  <td>{item?.description}</td>
                  <td>{getFileIcon(item?.file_name, "", "edit")}</td>
                  <td className="d-flex justify-content-center align-items-center gap-4 ">
                    <ModelEdit
                      edit_id={item?.id}
                      edit_data={item?.description}
                      edit_path="editUserGuid"
                      setOpen={setOpen}
                      dataMainClass={userGuid}
                      ministries_id={item?.id}
                      label="mainClass"
                      labelFelid={t("الوصف")}
                      imageName={item?.file_name}
                      image_id={item?.id}
                      setRefresh3={setRefresh3}
                    />
                    <AllowDelate
                      delete_id={item?.id}
                      path_delete={"deleteUserGuidById"}
                      setRefresh={setRefresh}
                      setOpen={setOpen}
                    />
                  </td>
                  <td>
                    <FormGroup>
                      <FormControlLabel
                        key={item?.id}
                        control={
                          <Checkbox
                            checked={active[item?.id] || false} // If the item ID exists in active, checkbox will be checked
                            onChange={handleCheckboxChange(item?.id)}
                          />
                        }
                        label={item?.label}
                      />
                    </FormGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>غلق</Button>
          <Button onClick={EditAccessTOfile} color="primary">
            حفظ التغييرات
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default UserGuidList;
