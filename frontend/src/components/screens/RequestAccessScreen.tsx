import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestAccessForm from "../authentication/RequestAccessForm";
import loginBg from "../../images/LoginSmaller.png";

export default function RequestAccessScreen() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <RequestAccessForm
        firstName={firstName}
        setFirstName={setFirstName}
        surname={surname}
        setSurname={setSurname}
        onBack={() => navigate("/login")}
      />
    </div>
  );
}
