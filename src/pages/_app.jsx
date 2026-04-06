import React, { useEffect } from 'react'
import '../styles.css'

const App = ({ Component, pageProps }) => {

  useEffect(() => {
    // Popunder
    const popunder = document.createElement('script')
    popunder.src = "https://pl29080807.profitablecpmratenetwork.com/e8/1a/47/e81a47b2576bc87cf8f49920b4371e77.js"
    popunder.async = true
    document.body.appendChild(popunder)

    // Social Bar
    const socialbar = document.createElement('script')
    socialbar.src = "https://pl29080809.profitablecpmratenetwork.com/83/dd/84/83dd844f4106e6a8ff404070e9dc90fe.js"
    socialbar.async = true
    document.body.appendChild(socialbar)

    // Native Banner
    const native = document.createElement('script')
    native.src = "https://pl29080810.profitablecpmratenetwork.com/c841041b43b906b5eb8a92eca0d02e20/invoke.js"
    native.async = true
    native.setAttribute("data-cfasync", "false")
    document.body.appendChild(native)

    // Banner
    window.atOptions = {
      key: '112837b6b5e2298ed150d448858acff5',
      format: 'iframe',
      height: 90,
      width: 728,
      params: {}
    }

    const banner = document.createElement('script')
    banner.src = "https://www.highperformanceformat.com/112837b6b5e2298ed150d448858acff5/invoke.js"
    banner.async = true
    document.body.appendChild(banner)

  }, [])

  return (
    <>
      {/* Smartlink (tu peux l'utiliser sur un bouton ou lien) */}
      <a 
        href="https://www.profitablecpmratenetwork.com/bxvj7gxi?key=5610af927880840bffc4b0ca8c8196a1" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ display: "none" }}
      >
        Smartlink
      </a>

      {/* Native Banner container */}
      <div id="container-c841041b43b906b5eb8a92eca0d02e20"></div>

      {/* Ton app */}
      <Component {...pageProps} />
    </>
  )
}

export default App
