import *as yup from 'yup'

export const   Loginyupp=yup.object({
    email:yup
    .string("email string türünden olmalı")
    .email("email formatında olmalı")
    .required("bu alan boş geçilemez"),
    password:yup
    .string("password string türünde olmalı")
    .required("bu alan boş geçilemez")
})