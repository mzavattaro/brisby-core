/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "760px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    spacing: {
      px: "1px",
      0: "0", //0px
      0.5: "0.125rem", //2px
      1: "0.25rem", //4px
      1.5: "0.375rem", //6px
      2: "0.5rem", //8px
      2.5: "0.625rem", //10px
      3: "0.75rem", //12px
      3.5: "0.875rem", //14px
      4: "1rem", //16px
      5: "1.25rem", //20px
      6: "1.5rem", //24px
      7: "1.75rem", //28px
      8: "2rem", //32px
      9: "2.25rem", //36px
      10: "2.5rem", //40px
      11: "2.75rem", //44px
      12: "3rem", //48px
      12.5: "3.125rem", //50px
      13: "3.25rem", //52px
      14: "3.5rem", //56px
      15: "3.75rem", //60px
      16: "4rem", //64px
      18: "4.5rem", //72px
      20: "5rem", //80px
      21: "5.125rem", //82px
      24: "6rem", //96px
      26: "6.5rem", //104px
      28: "7rem", //112px
      31: "7.875rem", //126px
      32: "8rem", //128px
      36: "9rem", //144px
      40: "10rem", //160px
      44: "11rem", //176px
      48: "12rem", //192px
      52: "13rem", //208px
      56: "14rem", //224px
      60: "15rem", //240px
      64: "16rem", //256px
      72: "18rem", //288px
      80: "20rem", //320px
      88: "22rem", //352px
      96: "24rem", //384px
      98: "30rem", //480px
      100: "32rem", //512px
      104: "34rem", //544px
      108: "36rem", //576px
      112: "38rem", //608px
      116: "40rem", //640px
      120: "42rem", //672px
      122: "42.25rem", //676px
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp"), require("@tailwindcss/forms")],
};
