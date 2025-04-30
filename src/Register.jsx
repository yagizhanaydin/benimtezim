import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';

import Webcam from "react-webcam";
import Countdown from "react-countdown";
import { Registeryup } from './schemas/Registeryup';

function Register() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isCounting, setIsCounting] = useState(false);

  const registerformik = useFormik({
    initialValues: {
      email: '',
      password: '',
      passwordagain: '',
      kullanici_adi:'',
      photo: null, 
    },
    validationSchema: Registeryup,
    onSubmit: async (values) => {
      try {
      
        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("passwordagain", values.passwordagain);
        formData.append("kullanici_adi", values.kullanici_adi);
        formData.append("photo", values.photo); // Fotoğrafı ekliyoruz

        const response = await axios.post("http://localhost:3000/api/auth/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },
  });

  // Fotoğraf çekme fonksiyonu
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setIsCounting(false);
    
    // Base64'ü Blob'a çevirip Formik'e kaydediyoruz
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "user-photo.jpg", { type: "image/jpeg" });
        registerformik.setFieldValue("photo", file); // Formik state'ine fotoğrafı ekle
      });
  };

  // 5 saniye geri sayım
  const startCountdown = () => {
    setIsCounting(true);
  };

  // Sayım tamamlanınca foto çek
  const handleCountdownComplete = () => {
    capture();
  };

  return (
    <div>
      <form onSubmit={registerformik.handleSubmit}>
    
        <input
          type="email"
          name="email"
          value={registerformik.values.email}
          onChange={registerformik.handleChange}
          onBlur={registerformik.handleBlur}
          placeholder='email'
        />
        {registerformik.touched.email && registerformik.errors.email && (
          <div>{registerformik.errors.email}</div>
        )}


        <input
          type="password"
          name="password"
          onChange={registerformik.handleChange}
          value={registerformik.values.password}
          onBlur={registerformik.handleBlur}
          placeholder='password'
        />
        {registerformik.touched.password && registerformik.errors.password && (
          <div>{registerformik.errors.password}</div>
        )}

     
        <input
          type="password"
          name="passwordagain"
          onChange={registerformik.handleChange}
          onBlur={registerformik.handleBlur}
          value={registerformik.values.passwordagain}
          placeholder='passwordagain'
        />
        {registerformik.touched.passwordagain && registerformik.errors.passwordagain && (
          <div>{registerformik.errors.passwordagain}</div>  
        )}

<input 
type="text"
name='kullanici_adi' 
placeholder='uygulama içi kullanıcı adınız'
value={registerformik.values.kullanici_adi}
onBlur={registerformik.handleBlur}
onChange={registerformik.handleChange}
/>
{registerformik.touched.kullanici_adi && registerformik.errors.kullanici_adi && (
  <div>{registerformik.errors.kullanici_adi}</div>
)}

        {/* Kamera Bölümü */}
        {!imgSrc ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
            />
            {isCounting ? (
              <div style={{ fontSize: "24px" }}>
                <Countdown
                  date={Date.now() + 5000}
                  renderer={({ seconds }) => <span>Fotoğraf çekiliyor: {seconds}</span>}
                  onComplete={handleCountdownComplete}
                />
              </div>
            ) : (
              <button type="button" onClick={startCountdown}>
                Fotoğraf Çek
              </button>
            )}
          </>
        ) : (
          <div>
            <h3>✅ Fotoğraf Çekildi!</h3>
            <img src={imgSrc} alt="User" width="200" />
            <button type="button" onClick={() => setImgSrc(null)}>
              Yeniden Çek
            </button>
          </div>
        )}

   
        <button 
          type="submit" 
          disabled={!imgSrc || registerformik.isSubmitting}
        >
          {registerformik.isSubmitting ? "Kaydediliyor..." : "Kayıt Ol"}
        </button>
      </form>
    </div>
  );
}

export default Register;