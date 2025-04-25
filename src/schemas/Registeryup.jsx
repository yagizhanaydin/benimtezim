import * as yup from 'yup'


export const Registeryup=yup.object({
   email:yup
   .string("email string cinsinden olmalı")
   .email("email formatın olmalı")
   .required("boş geçilemez"),
   password:yup
   .string("password string cinsinde olmalı")
   .required("password geçilemez"),
   passwordagain:yup
   .string("password string şeklinde olmalı")
   .required("password again boş geçilemez"),
})