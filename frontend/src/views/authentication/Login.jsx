import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../store/slices/authSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BoxArrowInRight, Facebook, Twitter } from 'react-bootstrap-icons';
import { Button, Heading, Checkbox, InputLabel, InputPassword } from '@/components/reactdash-ui';

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const logins = {
    login: "Đăng nhập", 
    link_login: "/auth/login", 
    forgot_link: "/auth/forgot", 
    register: "Đăng ký", 
    register_link: "/auth/register", 
    remember: "Ghi nhớ đăng nhập", 
    or: "Hoặc", 
    dont: "Chưa có tài khoản?", 
    login_fb: "Đăng nhập với Facebook", 
    login_twitter: "Đăng nhập với Twitter"
  }

  useEffect(() => {
    // Nếu đã đăng nhập, chuyển hướng đến trang chính
    if (isAuthenticated) {
      navigate('/');
    }
    // Xóa lỗi khi unmount
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (values) => {
    dispatch(login(values));
  };

  return (
    <>
      <Heading variant="h3" className="text-center">Đăng nhập</Heading>
      <hr className="block w-12 h-0.5 mx-auto my-5 bg-gray-700 border-gray-700" />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <Formik
        initialValues={{ email: '', password: '', remember: false }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="email" className="inline-block mb-2">Email</label>
              <Field 
                name="email" 
                type="email" 
                className={`block w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600 ${errors.email && touched.email ? 'border-red-500' : ''}`}
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            
            <div className="mb-4">
              <div className="flex flex-row justify-between items-center mb-2">
                <label htmlFor="password" className="inline-block">Mật khẩu</label>
                <Link to={logins.forgot_link} className="hover:text-blue-700">Quên mật khẩu?</Link>
              </div>
              <Field 
                name="password" 
                type="password" 
                className={`block w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600 ${errors.password && touched.password ? 'border-red-500' : ''}`}
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            
            <div className="mb-4">
              <Field
                type="checkbox"
                name="remember"
                id="remember"
                className="form-checkbox h-4 w-4 mr-2 text-indigo-600 transition duration-150 ease-in-out"
              />
              <label htmlFor="remember" className="inline-block">
                {logins.remember}
              </label>
            </div>

            <div className="grid">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <BoxArrowInRight className="inline-block w-4 h-4 ltr:mr-2 rtl:ml-2" />
                )}
                {loading ? 'Đang đăng nhập...' : logins.login}
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-4">
        <p className="text-center mb-3"><span>{logins.or}</span></p>
        <div className="text-center mb-6 sm:space-x-4">
          <a className="p-2 block sm:inline-block rounded lg:rounded-full leading-5 text-gray-100 bg-indigo-900 border border-indigo-900 hover:text-white hover:opacity-90 hover:ring-0 hover:border-indigo-900 focus:bg-indigo-900 focus:border-indigo-800 focus:outline-none focus:ring-0 mb-3" href="#">
            <Facebook className="inline-block w-4 h-4 mx-1" />
            <span className="inline-block lg:hidden">{logins.login_fb}</span>
          </a>
          <a className="p-2 block sm:inline-block rounded lg:rounded-full leading-5 text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 focus:outline-none focus:ring-0 mb-3" href="#">
            <Twitter className="inline-block w-4 h-4 mx-1" />
            <span className="inline-block lg:hidden">{logins.login_twitter}</span>
          </a>
        </div>
        <p className="text-center mb-4">{logins.dont} <Link to={logins.register_link} className="hover:text-indigo-500">{logins.register}</Link></p>
      </div>
    </>
  );
}