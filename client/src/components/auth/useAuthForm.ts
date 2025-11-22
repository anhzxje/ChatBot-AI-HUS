import { useEffect, useState, SyntheticEvent } from "react";

import { useLogin, useSignup } from "../../store/auth";

// --- THÊM ĐOẠN NÀY: Hàm dịch lỗi từ Server sang Tiếng Việt ---
const translateServerError = (errorMessage: string) => {
  if (!errorMessage) return "";
  
  // Danh sách các lỗi thường gặp từ Server
  if (errorMessage.includes("Incorrect email")) return "Email hoặc mật khẩu không chính xác.";
  if (errorMessage.includes("User already exists")) return "Email này đã được đăng ký.";
  if (errorMessage.includes("Password")) return "Mật khẩu không hợp lệ.";
  if (errorMessage.includes("server")) return "Lỗi kết nối máy chủ.";
  
  return errorMessage; // Nếu lỗi lạ thì giữ nguyên
};
// -------------------------------------------------------------

const useAuthForm = (loginView: boolean) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValidationError, setPasswordValidationError] = useState("");
  const { login, error: loginError, clearError: clearLoginError } = useLogin();
  const {
    signup,
    error: signupError,
    clearError: clearSignupError,
  } = useSignup();

  // --- SỬA ĐOẠN NÀY: Áp dụng hàm dịch lỗi ---
  const rawError = loginError || signupError || passwordValidationError;
  const error = translateServerError(rawError); 
  // ------------------------------------------

  const clearError = () => {
    setPasswordValidationError("");
    clearLoginError();
    clearSignupError();
  };

  useEffect(() => {
    clearError();
  }, [loginView]);

  const isValidPassword = () => {
    if (password.length < 8) {
      setPasswordValidationError(
        "Mật khẩu phải có ít nhất 8 ký tự."
      );
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordValidationError("Mật khẩu xác nhận không khớp.");
      return false;
    }
    return true;
  };

  const handleContinue = (e: SyntheticEvent) => {
    e.preventDefault();
    clearError();
    if (loginView) {
      login(email, password);
    } else if (isValidPassword()) {
      signup(email, password);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleContinue,
    error,
    clearError,
  };
};

export default useAuthForm;