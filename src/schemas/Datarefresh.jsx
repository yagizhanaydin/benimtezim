import * as yup from 'yup'


export const Dataupdate=yup.object({
    email:yup
    .string("email string türünden olmak zorunda")
    .email("email türünden olmak zorunda"),
    password:yup
    .string("string türünden olmalı")
    .min(6,"password en az 6 karakterli olamlı") 
    .max("passowrd en  çok 12 karakter içerebilir"),
     
    passwordagain:yup
    .string("string türünden olmalı")
    .oneOf([yup.ref('password'),"şifreler uyuşmalı"]),

     kullanici_adi:yup
     .string("kullanıcı adı string türünden olmalı")
     .min(6,"en az 6 karakter olmalı")
    .max(15,"en fazla 15 karakter olabilir")
})