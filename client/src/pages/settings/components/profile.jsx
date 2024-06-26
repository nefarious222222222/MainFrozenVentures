import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { UserContext } from "../../../context/user-context";
import municipalitiesInBataan from "../../../municipalities";
import Select from "react-select";
import { SuccessMessage } from "../../../components/success-message";
import { ErrorMessage } from "../../../components/error-message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

export const Profile = () => {
  const { user } = useContext(UserContext);
  const {
    register: registerPersonal,
    handleSubmit: handleSubmitPersonal,
    setValue: setValuePersonal,
    getValues: getValuesPersonal,
  } = useForm();
  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    setValue: setValueAddress,
    getValues: getValuesAddress,
  } = useForm();
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [barangays, setBarangays] = useState([]);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [initialPersonalValues, setInitialPersonalValues] = useState({});
  const [initialAddressValues, setInitialAddressValues] = useState({});
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (user.accountId) {
        try {
          const response = await axios.post(
            "http://localhost:8081/account/accountFetch",
            {
              accountId: user.accountId,
            }
          );
          if (response.data.status === 1) {
            const userData = response.data.account;

            const birthdate = new Date(userData.birthdate)
              .toISOString()
              .split("T")[0];

            setInitialPersonalValues({
              firstName: userData.firstName,
              lastName: userData.lastName,
              gender: userData.gender,
              birthdate: birthdate,
            });

            setInitialAddressValues({
              street: userData.street,
              municipality: userData.municipality,
              barangay: userData.barangay,
              province: userData.province,
              zipCode: userData.zipCode,
            });

            setValuePersonal("firstName", userData.firstName);
            setValuePersonal("lastName", userData.lastName);
            setValuePersonal("gender", userData.gender);
            setSelectedGender(userData.gender);
            setValuePersonal("birthdate", birthdate);

            setValueAddress("street", userData.street);
            setValueAddress("municipality", userData.municipality);
            setValueAddress("barangay", userData.barangay);
            setValueAddress("province", userData.province);
            setValueAddress("zipCode", userData.zipCode);
            setSelectedMunicipality(userData.municipality);
            setSelectedBarangay(userData.barangay);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user.accountId, setValuePersonal, setValueAddress]);

  useEffect(() => {
    const selectedMunicipalityObj = municipalitiesInBataan.find(
      (municipality) => municipality.name === selectedMunicipality
    );

    if (selectedMunicipalityObj) {
      setBarangays(
        selectedMunicipalityObj.barangays.map((barangay) => barangay.name)
      );
    } else {
      setBarangays([]);
    }
  }, [selectedMunicipality]);

  useEffect(() => {
    if (selectedMunicipality && selectedBarangay) {
      const selectedMunicipalityObj = municipalitiesInBataan.find(
        (municipality) => municipality.name === selectedMunicipality
      );
      if (selectedMunicipalityObj) {
        const selectedBarangayObj = selectedMunicipalityObj.barangays.find(
          (barangay) => barangay.name === selectedBarangay
        );
        if (selectedBarangayObj) {
          setValueAddress("zipCode", selectedBarangayObj.zipCode);
        }
      }
    }
  }, [selectedMunicipality, selectedBarangay, setValueAddress]);

  const getMaxDate = () => {
    const today = new Date();
    const maxYear = today.getFullYear() - 13;
    const maxMonth = today.getMonth() + 1;
    const maxDay = today.getDate();
    return `${maxYear}-${String(maxMonth).padStart(2, "0")}-${String(
      maxDay
    ).padStart(2, "0")}`;
  };

  const handleEditPersonalInfo = () => {
    setIsEditingPersonal(true);
    setIsEditingAddress(false);
  };

  const handleCancelEditPersonal = () => {
    setValuePersonal("firstName", initialPersonalValues.firstName);
    setValuePersonal("lastName", initialPersonalValues.lastName);
    setValuePersonal("gender", initialPersonalValues.gender);
    setValuePersonal("birthdate", initialPersonalValues.birthdate);
    setIsEditingPersonal(false);
  };

  const handleEditAddressInfo = () => {
    setIsEditingAddress(true);
    setIsEditingPersonal(false);
  };

  const handleCancelEditAddress = () => {
    setValueAddress("street", initialAddressValues.street);
    setValueAddress("municipality", initialAddressValues.municipality);
    setValueAddress("barangay", initialAddressValues.barangay);
    setValueAddress("province", initialAddressValues.province);
    setValueAddress("zipCode", initialAddressValues.zipCode);
    setSelectedMunicipality(initialAddressValues.municipality);
    setSelectedBarangay(initialAddressValues.barangay);
    setIsEditingAddress(false);
  };

  const onSubmitPersonal = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/account/personalUpdate",
        {
          ...data,
          gender: selectedGender,
          accountId: user.accountId,
        }
      );
      if (response.data.status === "success") {
        setMessageTitle("Success");
        setMessage(response.data.message);
        setInitialPersonalValues(data);
      } else {
        setMessageTitle("Error");
        setMessage(response.data.message);
        setValuePersonal("firstName", initialPersonalValues.firstName);
        setValuePersonal("lastName", initialPersonalValues.lastName);
        setValuePersonal("gender", initialPersonalValues.gender);
        setValuePersonal("birthdate", initialPersonalValues.birthdate);
        setSelectedGender(initialPersonalValues.gender);
      }
    } catch (error) {
      setMessageTitle("Error");
      setMessage("Something went wrong");
    }

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
    }, 3000);
    setIsEditingPersonal(false);
  };

  const onSubmitAddress = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/account/addressUpdate",
        {
          ...data,
          municipality: selectedMunicipality,
          barangay: selectedBarangay,
          accountId: user.accountId,
        }
      );
      if (response.data.status === "success") {
        setMessageTitle("Success");
        setMessage(response.data.message);
        setInitialAddressValues(data);
      } else {
        setMessageTitle("Error");
        setMessage(response.data.message);
        setValueAddress("street", initialAddressValues.street);
        setValueAddress("municipality", initialAddressValues.municipality);
        setValueAddress("barangay", initialAddressValues.barangay);
        setValueAddress("province", initialAddressValues.province);
        setValueAddress("zipCode", initialAddressValues.zipCode);
        setSelectedMunicipality(initialAddressValues.municipality);
        setSelectedBarangay(initialAddressValues.barangay);
      }
    } catch (error) {
      setMessageTitle("Error");
      setMessage("Something went wrong");
    }

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
    }, 3000);
    setIsEditingAddress(false);
  };

  return (
    <>
      {messageTitle && messageTitle === "Error" && (
        <ErrorMessage title={messageTitle} message={message} />
      )}
      {messageTitle && messageTitle === "Success" && (
        <SuccessMessage title={messageTitle} message={message} />
      )}
      <div className="flex text-4xl font-bold">
        <FontAwesomeIcon icon={faUserCircle} className="mr-3" />
        <h2>Profile</h2>
      </div>

      <div className="mt-3">
        <div className="flex items-center">
          <p className="w-60 font-semibold text-gray-200">
            Personal Information
          </p>
          <div className="w-full border-t-2"></div>
        </div>

        <form
          onSubmit={handleSubmitPersonal(onSubmitPersonal)}
          className="flex flex-col items-center gap-5 py-5"
        >
          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="firstName" className="text-lg font-medium">
              First Name:
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="text-lg px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
              {...registerPersonal("firstName")}
              disabled={!isEditingPersonal}
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="lastName" className="text-lg font-medium">
              Last Name:
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="text-lg px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
              {...registerPersonal("lastName")}
              disabled={!isEditingPersonal}
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="gender" className="text-lg font-medium">
              Gender:
            </label>
            <Select
              className="text-lg border-gray-200 rounded-[5px] w-full outline-purple-200"
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Prefer not to say", label: "Prefer not to say" },
              ]}
              value={{
                value: selectedGender,
                label: selectedGender,
              }}
              onChange={(selectedOption) =>
                setSelectedGender(selectedOption.value)
              }
              isDisabled={!isEditingPersonal}
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="birthdate" className="text-lg font-medium">
              Birthdate:
            </label>
            <input
              type="date"
              name="birthdate"
              id="birthdate"
              className="text-lg px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
              {...registerPersonal("birthdate")}
              max={getMaxDate()}
              disabled={!isEditingPersonal}
            />
          </div>

          {isEditingPersonal ? (
            <div className="w-full flex justify-around">
              <button
                type="button"
                onClick={handleCancelEditPersonal}
                className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleEditPersonalInfo}
                className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              >
                Edit Personal Information
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="mt-20">
        <div className="flex items-center">
          <p className="w-60 font-semibold text-gray-200">
            Address Information
          </p>
          <div className="w-full border-t-2"></div>
        </div>

        <form
          onSubmit={handleSubmitAddress(onSubmitAddress)}
          className="flex flex-col items-center gap-5 py-5"
        >
          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="street" className="text-lg font-medium">
              Street:
            </label>
            <input
              type="text"
              name="street"
              id="street"
              className="text-lg px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
              {...registerAddress("street")}
              disabled={!isEditingAddress}
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="municipality" className="text-lg font-medium">
              Municipality:
            </label>
            <Select
              className="text-lg border-gray-200 rounded-[5px] w-full outline-purple-200"
              options={municipalitiesInBataan.map((municipality) => ({
                value: municipality.name,
                label: municipality.name,
              }))}
              value={{
                value: selectedMunicipality,
                label: selectedMunicipality,
              }}
              onChange={(selectedOption) =>
                setSelectedMunicipality(selectedOption.value)
              }
              isDisabled={!isEditingAddress}
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="barangay" className="text-lg font-medium">
              Barangay:
            </label>
            <Select
              className="text-lg border-gray-200 rounded-[5px] w-full outline-purple-200"
              options={barangays.map((barangay) => ({
                value: barangay,
                label: barangay,
              }))}
              value={{ value: selectedBarangay, label: selectedBarangay }}
              onChange={(selectedOption) =>
                setSelectedBarangay(selectedOption.value)
              }
              isDisabled={!isEditingAddress}
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="province" className="text-lg font-medium">
              Province:
            </label>
            <input
              type="text"
              name="province"
              id="province"
              className="text-lg px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
              {...registerAddress("province")}
              disabled={!isEditingAddress}
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="zipCode" className="text-lg font-medium">
              Zip Code:
            </label>
            <input
              type="text"
              name="zipCode"
              id="zipCode"
              className="text-lg px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
              {...registerAddress("zipCode")}
              disabled={!isEditingAddress}
            />
          </div>

          {isEditingAddress ? (
            <div className="w-full flex justify-around">
              <button
                type="button"
                onClick={handleCancelEditAddress}
                className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleEditAddressInfo}
                className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              >
                Edit Address Information
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};
