import * as yup from 'yup';

export const Registeryup = yup.object({
  email: yup
    .string("email string cinsinden olmalı")
    .email("email formatın olmalı")
    .required("boş geçilemez"),

  password: yup
    .string("password string cinsinde olmalı")
    .required("password geçilemez"),

  passwordagain: yup
    .string("password string şeklinde olmalı")
    .oneOf([yup.ref('password'), null], "Şifreler eşleşmiyor")
    .required("password again boş geçilemez"),

  kullanici_adi: yup
    .string("kullanıcı adı string türünden olmalı")
    .required("bu alanın doldurulması zorunludur")
    .min(5, "kullanıcı adı en az 5 karakterden oluşmalı")
    .max(12, "kullanıcı adı maksimum 12 karakter olabilir")
});
