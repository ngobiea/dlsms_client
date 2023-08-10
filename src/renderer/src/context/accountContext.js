import React, { createContext,useMemo } from 'react';
import { useForm } from 'react-hook-form';
const AccountContext = createContext();

const AccountProvider = ({ children }) => {
  const {
    register,
    handleSubmit,
    resetField,
    reset,
    formState: { errors, isSubmitSuccessful },
    setValue,
  } = useForm();
  const values = useMemo(() => {
    return {
      register,
      handleSubmit,
      resetField,
      reset,
      errors,
      isSubmitSuccessful,
      setValue,
    };
  }, [register, handleSubmit, reset, errors, isSubmitSuccessful]);
  return (
    <AccountContext.Provider value={values}>{children}</AccountContext.Provider>
  );
};
export { AccountProvider };
export default AccountContext;
