"use strict"

const ajax = async ({method, url, params = {}, callback, callbackErr}) => {
  let response;
  await axios({
    method,
    url,    
    params    
  })
  .then(res => {
    response = res;    
  })
  .catch(err => {});
  return response;
};

const marcaCCS = `
  <svg version="1.1" id="marca" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 298.3 149.3" enable-background="new 0 0 298.3 149.3" xml:space="preserve">
  <g display="none">
    <rect x="-35.2" y="-32.2" display="inline" fill="#EDEDED" width="373" height="211.5"/>
  </g>
  <g display="none">
    <path display="inline" fill="#C6C6C6" d="M300.9,81.3h-17.4l-0.1,0.4l-4.3,20.8l-0.6,0.1l-17.1,2.3L261,105l-0.1,0.4l-0.3,2.1
      c-0.2-0.5-0.5-1.1-0.9-1.7c0-0.1-0.1-0.2-0.1-0.2c1.6-1,3-2.3,4.2-3.7c1.5-1.8,2.5-4,3-6.5c0.6-3,0.4-5.7-0.7-7.9
      c-1.2-2.4-3.1-4.1-5.6-5c-2-0.7-4.8-1.1-8.7-1.1h-43.1c4-4.1,6.2-9.2,6.6-15c1.7-23.6-18.9-29-32.5-32.6
      c-6.3-1.7-13.5-3.6-13.6-6.3c0.3-0.4,2.8-2,10.4-2s16.2,1.7,20.1,3.9l3,1.8l0.5,0.3l0.2-0.6l9.4-24.7l0.2-0.5l-0.5-0.1l-3.2-0.9
      c-1.9-0.5-3.6-1-5.1-1.4c-8.8-2.5-13.1-3.8-27.1-3.8c-9.7,0-20.3,3.1-28.5,8.2l0.5-1.8l0.1-0.4l-0.4-0.2l-2.6-1
      c-7.3-2.8-20-4.1-29.4-4.1c-10.1,0.1-19.9,2-28.3,5.6l-1.6-0.6c-8.4-3-17.8-4.6-27-4.6C45.2,0.5,31,4.7,20.4,12.2
      C8.3,20.8,1.7,33.2,1.3,47.9C0.9,60.3,4.8,70.8,12.7,79c10,10.3,25.8,16,44.3,16c9.9,0,20.3-1.7,30.1-5l1.5-0.5
      c7.8,2.8,16.9,4.3,27,4.3c8.7,0,18-1.1,27.8-3.1c3.4,1,7.3,1.9,11.4,2.5l-2.5,11.9c-0.4,2-0.5,4.4-0.3,7c0.2,2,0.9,3.9,2,5.6
      c1.1,1.8,2.6,3.2,4.3,4.1c1.6,1,3.7,1.6,6.1,1.9c2.1,0.3,4.1,0.4,5.9,0.4c3.3,0,6.4-0.5,9-1.4c2-0.7,4.1-1.9,6-3.5
      c2-1.7,3.6-3.6,4.9-5.8c1.2-2.2,2.1-4.5,2.6-6.9l3.6-17.3h0.1l-6.3,30.1l-0.7,3.6l-0.1,0.6h18l0.1-0.4l2.9-13.9H224l0.1-0.4
      l2.7-12.8h1.1l-4.8,23.3l-0.7,3.6l-0.1,0.6h18l0.1-0.4l2.2-10.7l3.6,10.8l0.1,0.3h19.6l-0.2-0.6l-0.5-1.6c0.5,0.4,1,0.7,1.6,1
      c2.3,1.3,5.4,1.9,9.6,1.9c4,0,7.5-0.9,10.5-2.7s5.2-4,6.7-6.6c1.3-2.4,2.4-5.8,3.3-10.1l4.7-22.7l0.1-0.6h-0.8L300.9,81.3z
      M59.7,12.7c4.9,0,10.1,0.6,15,1.6c-10,8.5-15.5,20.1-15.5,32.7c0,14.5,4.9,26,14.6,34.2C68.3,82.4,62.6,83,57.4,83
      c-19.9,0-41.2-9.2-41.2-35c0-9.4,3-17.2,9-23.2C32.8,17.2,45.4,12.7,59.7,12.7z M135.1,26.6c-1.2,23.7,19.6,29.1,33.3,32.7
      c9.2,2.4,13.3,3.8,12.8,6.1c-0.3,1.3-3.4,2.7-9.7,2.7c-9.1,0-20.6-2.7-27.3-5.3l-3-1.2l-0.5-0.2l-0.2,0.5l-1,3
      c-0.7,2.1-1.4,4.3-2.1,7c-5.8,1.4-11.9,2.1-17.5,2.1c-8.3,0-35.4-2-35.4-27.1C84.5,38,88,31.1,95,26.4c6.2-4.3,15.1-6.6,25-6.6
      c5.3,0,10.8,0.7,15.9,2C135.5,23.5,135.1,25.1,135.1,26.6z M175.1,105.5c-0.2,1.2-0.7,2-1.3,2.5s-1.4,0.8-2.5,0.8
      c-0.9,0-1.3-0.2-1.3-0.3c-0.1-0.1-0.2-0.6,0-1.6l2.7-13.1c1.7-0.1,3.3-0.3,4.9-0.4L175.1,105.5L175.1,105.5z"/>
  </g>
  <path fill="#16A961" d="M83.3,82.2l2.7,4.5c-9.6,3.2-19.5,4.8-29,4.8C28.5,91.5,3.9,77,4.8,48C5.7,18.8,32.5,4,60.3,4
    C69.1,4,78,5.5,86.1,8.4l-2.7,4.7c-7.6-2.6-15.8-3.9-23.8-3.9c-24.3,0-47,12.2-47,38.8c0,25.9,20.2,38.5,44.7,38.5
    C65.8,86.5,74.6,85.1,83.3,82.2z"/>
  <path fill="#28804D" d="M141.4,74.7l2.2,12.4c-9.8,2.1-19.2,3.2-28,3.2c-30.8,0-52.9-13.7-52.9-43.3c0-24,21.9-43.2,54.5-43.5
    c8.4,0,21,1.1,28.1,3.8l-3.5,12.5c-6.8-2.3-14.3-3.5-21.7-3.5c-20,0-39,9.1-39,30.7c0,21.9,18.4,30.6,38.9,30.6
    C127.1,77.6,134.5,76.6,141.4,74.7z"/>
  <path fill="#2B5B39" d="M212,66c-1.3,18.1-22.1,23.5-41.4,24.4c-1.1,0.1-2.2,0.1-3.3,0.1c-10.7,0-23.1-2.4-29.7-5.9
    c1.9-5.6,3.4-12.8,5.3-18.5c7.1,2.8,19.2,5.5,28.6,5.5c6.9,0,12.3-1.5,13.1-5.5c3-14.8-47.8-4.5-46.1-39.3
    c0.6-12.3,20.5-24.1,38.9-24.1c15.8,0,18.6,1.6,31.2,5.1c-2.3,6.1-4.7,12.2-7,18.3c-4.5-2.6-13.9-4.4-21.9-4.4
    c-7.5,0-13.9,1.6-13.9,5.4C165.9,41.3,214.4,32.1,212,66L212,66z"/>
  <path fill="#AF3437" d="M297.3,84.8l-4,19.1c-0.8,4-1.8,7-3,9.1c-1.1,2.1-2.9,3.9-5.4,5.3c-2.4,1.5-5.3,2.2-8.7,2.2
    c-3.5,0-6.2-0.5-7.9-1.4c-1.8-1-3-2.4-3.6-4.2c-0.7-1.8-0.8-4.1-0.5-6.8l10.7-1.4c-0.3,1.5-0.4,2.7-0.3,3.4c0.1,0.8,0.4,1.4,0.9,1.8
    c0.3,0.3,0.9,0.5,1.7,0.5c1.2,0,2.2-0.5,3-1.3c0.8-0.9,1.3-2.4,1.8-4.6l4.5-21.6L297.3,84.8L297.3,84.8z"/>
  <path fill="#AF3437" d="M263,88.8c-0.8-1.6-2-2.6-3.6-3.2s-4.1-0.9-7.5-0.9h-18.1l-7.3,35.1h10.9l3-14.2h1c1,0,1.8,0.3,2.5,0.8
    c0.5,0.4,1,1.3,1.4,2.7l3.6,10.7H261l-3.1-10.2c-0.2-0.5-0.5-1.2-1.1-2.2c-0.6-0.9-1-1.5-1.3-1.8c-0.5-0.4-1.4-0.9-2.6-1.3
    c1.7-0.4,3-0.8,4.1-1.4c1.6-0.9,3-2,4.1-3.4s1.9-3.1,2.3-5C263.9,92.3,263.8,90.4,263,88.8L263,88.8z M252.4,95.4
    c-0.2,0.8-0.5,1.5-1.1,2c-0.6,0.6-1.3,0.9-2,1.1c-1.5,0.3-2.5,0.5-3,0.5h-4.6l1.5-7.1h4.8c2,0,3.3,0.3,3.9,0.9
    C252.4,93.4,252.6,94.2,252.4,95.4L252.4,95.4z"/>
  <polygon fill="#AF3437" points="210.3,92.3 209.1,98.4 222.7,98.4 221.2,105.5 207.6,105.5 204.6,119.9 193.7,119.9 201,84.8 
    227.8,84.8 226.3,92.3 "/>
  <path fill="#AF3437" d="M193.8,84.8l-4.4,20.9c-0.4,2.1-1.2,4-2.2,5.9c-1,1.8-2.4,3.5-4,4.8c-1.7,1.4-3.3,2.3-5,2.9
    c-2.3,0.8-4.9,1.2-7.8,1.2c-1.7,0-3.6-0.1-5.5-0.4c-2-0.2-3.5-0.7-4.8-1.4c-1.2-0.7-2.2-1.7-3.1-3c-0.8-1.3-1.3-2.7-1.5-4
    c-0.2-2.2-0.1-4.2,0.2-5.9l4.4-20.9H171l-4.5,21.4c-0.4,1.9-0.2,3.4,0.6,4.5s2.2,1.6,4.1,1.6s3.4-0.5,4.7-1.6s2.1-2.6,2.5-4.5
    l4.5-21.4L193.8,84.8L193.8,84.8z"/>
  <path fill="#16A961" d="M261.9,45v-6.5c8.1,0,14.6-6.6,14.6-14.6s-6.6-14.6-14.6-14.6V2.8c11.6,0,21.1,9.5,21.1,21.1
    S273.6,45,261.9,45z"/>
  <rect x="237.6" y="2.8" fill="#2B5B39" width="16.2" height="6.5"/>
  <path fill="#28804D" d="M245.7,45c-8.9,0-16.2-7.3-16.2-16.2h6.5c0,5.4,4.4,9.8,9.8,9.8s9.8-4.4,9.8-9.8S251,19,245.7,19h-8.1v-6.5
    h8.1c8.9,0,16.2,7.3,16.2,16.2S254.6,45,245.7,45L245.7,45z"/>
  <path fill="#AF3437" d="M238,60h-5.3c-0.5,1.1-0.9,2-1.1,2.7c-0.2,0.6-0.3,1.2-0.3,1.7v0.2H231h-0.2c-0.4,0-0.7-0.1-1-0.3
    c-0.2-0.2-0.3-0.4-0.3-0.8s0.6-1.8,1.9-4.3s2.4-4.9,3.3-7.1c-0.1-0.1-0.2-0.3-0.3-0.4s-0.2-0.3-0.4-0.4c0.2-0.3,0.5-0.5,0.7-0.7
    c0.2-0.1,0.4-0.2,0.6-0.2c0.3,0,0.6,0.2,0.8,0.5c0.3,0.4,0.6,1,0.9,1.8s0.7,1.8,1.3,3.1c1.8,4.6,3.1,7.2,3.8,7.9
    c-0.2,0.3-0.5,0.5-0.7,0.6s-0.4,0.2-0.7,0.2c-0.7,0-1.4-1.1-2.2-3.4C238.2,60.6,238.1,60.3,238,60L238,60z M235.4,53.7l-0.5,1.1
    c-0.8,1.8-1.3,3.1-1.7,3.9h4.1c-0.3-0.9-0.7-1.8-1-2.6C236.1,55.2,235.8,54.4,235.4,53.7L235.4,53.7z"/>
  <path fill="#AF3437" d="M255.5,64.6c-1.2-1.2-2.8-3-5-5.5c-2.1-2.5-3.7-4.2-4.7-5.3c0,2.5,0.1,5,0.1,7.8v1.3c0,0.6-0.1,1.1-0.2,1.3
    s-0.4,0.3-0.8,0.3c-0.2,0-0.5,0-0.8-0.1s-0.5-0.2-0.8-0.4c0.4-0.6,0.6-1.5,0.7-2.6s0.2-3.1,0.2-6c0-1.3-0.1-2.3-0.2-2.9
    c-0.2-0.6-0.5-1-0.9-1.2c0.3-0.3,0.5-0.6,0.8-0.7c0.2-0.1,0.4-0.2,0.7-0.2c0.2,0,0.4,0.1,0.6,0.2s0.5,0.4,0.7,0.7l0.4,0.4
    c2.5,3,5.3,6.2,8.4,9.7v-2.6v-1.9c0-1.7-0.1-3.1-0.2-4s-0.4-1.6-0.7-2.2c0.3-0.2,0.6-0.3,0.8-0.3c0.2-0.1,0.5-0.1,0.7-0.1
    c0.4,0,0.6,0.1,0.8,0.3c0.1,0.2,0.2,0.7,0.2,1.4c0,0.4,0,1.5-0.1,3.2s-0.1,3.2-0.1,4.4c0,0.8,0,1.6,0.1,2.3c0,0.7,0.1,1.4,0.2,2
    L255.5,64.6L255.5,64.6z"/>
  <path fill="#AF3437" d="M266.3,64.8c-1,0-1.9-0.2-2.8-0.5s-1.6-0.8-2.3-1.4c-0.7-0.7-1.2-1.4-1.6-2.3s-0.5-1.9-0.5-3s0.2-2.1,0.6-3
    s0.9-1.7,1.7-2.4c0.7-0.7,1.6-1.2,2.5-1.6c1-0.4,2-0.5,3.1-0.5c2.2,0,4,0.6,5.3,1.9s2,2.9,2,5c0,1-0.2,2-0.5,2.9
    c-0.4,0.9-0.9,1.7-1.6,2.4c-0.8,0.8-1.7,1.4-2.7,1.9C268.6,64.6,267.5,64.8,266.3,64.8z M272.3,57.1c0-1.7-0.5-3-1.5-4
    s-2.3-1.5-4-1.5s-3.1,0.5-4.1,1.6s-1.5,2.5-1.5,4.2c0,1.7,0.5,3.1,1.5,4.1c1,1.1,2.3,1.6,3.9,1.6c1.7,0,3.1-0.6,4.1-1.7
    C271.8,60.3,272.3,58.9,272.3,57.1z"/>
  <path fill="#AF3437" d="M276.5,62.3c0.3,0.2,0.6,0.3,0.9,0.3c0.3,0.1,0.6,0.1,0.9,0.1c0.8,0,1.4-0.2,1.8-0.5
    c0.4-0.4,0.7-0.8,0.7-1.4c0-0.7-0.6-1.6-1.8-2.5l-0.1-0.1c-1.7-1.4-2.5-2.5-2.5-3.6c0-0.5,0.1-0.9,0.3-1.4s0.5-0.9,0.9-1.3
    c0.6-0.6,1.2-1,1.9-1.3s1.4-0.4,2.1-0.4c0.5,0,0.9,0.1,1.1,0.3c0.3,0.2,0.4,0.4,0.4,0.8c0,0.1,0,0.3-0.1,0.5s-0.2,0.4-0.4,0.7
    c-0.3-0.1-0.5-0.2-0.8-0.2s-0.5-0.1-0.8-0.1c-0.8,0-1.5,0.2-2,0.6s-0.7,0.9-0.7,1.5c0,0.4,0.1,0.7,0.3,1.1c0.2,0.3,0.6,0.7,1.1,1.1
    l0.3,0.3c1.8,1.5,2.7,2.7,2.7,3.8c0,0.4-0.1,0.8-0.2,1.2s-0.4,0.8-0.6,1.1c-0.5,0.6-1.1,1.1-1.8,1.4s-1.5,0.5-2.3,0.5
    c-0.6,0-1-0.1-1.3-0.3s-0.4-0.5-0.4-0.8c0-0.2,0-0.4,0.1-0.5C276.2,62.8,276.3,62.5,276.5,62.3L276.5,62.3z"/>
  <path fill="#006633" d="M225.6,72.3c1.3,0.3,2.8,0.6,4.3,0.9c1.5,0.2,3,0.4,4.5,0.6c3,0.3,6.1,0.4,9.1,0.5c6.1,0,12.3-0.4,18.4-1.4
    c6.1-0.9,12.2-2.1,18.2-3.6c3-0.8,6-1.7,8.9-2.8c1.4-0.6,2.9-1.2,4.3-1.9s2.8-1.5,3.9-2.6c-1,1.2-2.4,2-3.7,2.9
    c-1.3,0.8-2.7,1.5-4.2,2.2c-2.8,1.3-5.8,2.4-8.7,3.5c-5.9,2-12,3.6-18.1,5s-12.4,2.3-18.8,2.7c-3.2,0.2-6.4,0.3-9.6,0.2
    c-1.6,0-3.2-0.1-4.8-0.3c-1.6-0.1-3.2-0.3-4.9-0.6c-1.4-0.3-2.4-1.7-2.1-3.1s1.7-2.4,3.1-2.1C225.4,72.3,225.5,72.3,225.6,72.3
    L225.6,72.3z"/>
  <path d="M295.2,138.1c-0.3-0.8-0.9-1.5-1.6-1.9c-0.7-0.5-1.6-0.7-2.8-0.7c-0.8,0-1.6,0.2-2.3,0.4c-0.7,0.2-1.3,0.5-1.9,1
    c-0.6,0.5-1,1-1.4,1.7c-0.4,0.6-0.7,1.4-0.8,2.2c-0.1,0.9-0.1,1.6,0.1,2.3c0.1,0.7,0.5,1.3,0.9,1.7c0.5,0.4,1,0.8,1.7,1
    c0.6,0.2,1.4,0.3,2.2,0.3c0.6,0,1.1-0.1,1.7-0.2c0.6-0.1,1.1-0.3,1.6-0.6c0.6-0.3,1-0.7,1.4-1.1c0.4-0.4,0.8-0.9,1-1.5h-3.4
    c-0.2,0.3-0.5,0.6-0.8,0.7c-0.3,0.1-0.6,0.2-1,0.2c-0.8,0-1.3-0.2-1.6-0.6c-0.3-0.4-0.4-1-0.3-1.7h7.4l0.1-0.4
    C295.6,139.8,295.5,138.8,295.2,138.1z M288.3,139.2c0.1-0.3,0.3-0.5,0.5-0.8c0.2-0.2,0.5-0.4,0.8-0.5c0.3-0.1,0.6-0.2,1-0.2
    c0.3,0,0.6,0.1,0.9,0.2c0.3,0.1,0.5,0.3,0.6,0.5c0.2,0.2,0.2,0.5,0.3,0.8H288.3z M288.3,139.2L288.3,139.2
    C288.3,139.3,288.3,139.2,288.3,139.2L288.3,139.2z M281.2,129.6l-1.1,7.1c-0.2-0.3-0.5-0.5-0.8-0.7s-0.6-0.3-1-0.4
    c-0.4-0.1-0.7-0.1-1.1-0.1c-0.7,0-1.4,0.2-2.1,0.4c-0.7,0.3-1.2,0.7-1.8,1.2c-0.5,0.5-0.9,1.1-1.3,1.7c-0.3,0.6-0.6,1.3-0.7,2
    c-0.1,0.6-0.1,1.1,0,1.7c0.1,0.5,0.2,1,0.4,1.5c0.2,0.4,0.5,0.8,0.9,1.2c0.4,0.3,0.8,0.6,1.3,0.8s1,0.3,1.6,0.3
    c0.4,0,0.8-0.1,1.2-0.2c0.4-0.1,0.8-0.3,1.1-0.5c0.4-0.2,0.7-0.5,0.9-0.8l-0.1,0.9h3.5l2.6-16.1H281.2z M279.5,140.7
    c-0.1,0.4-0.2,0.8-0.5,1.1c-0.2,0.3-0.5,0.6-0.9,0.8c-0.4,0.2-0.8,0.3-1.3,0.3s-0.9-0.1-1.2-0.3c-0.3-0.2-0.5-0.5-0.6-0.8
    c-0.1-0.3-0.2-0.7-0.1-1.1c0.1-0.4,0.2-0.8,0.5-1.1c0.2-0.3,0.5-0.6,0.9-0.8s0.8-0.3,1.3-0.3s0.9,0.1,1.2,0.3s0.5,0.5,0.6,0.8
    C279.5,139.9,279.6,140.3,279.5,140.7z M266.9,135.7l-0.8,5.3c-0.1,0.4-0.2,0.8-0.3,1.1c-0.1,0.3-0.4,0.6-0.6,0.8
    c-0.3,0.2-0.7,0.3-1.1,0.3c-0.4,0-0.7-0.1-0.9-0.2c-0.2-0.1-0.4-0.3-0.5-0.4c-0.1-0.2-0.1-0.4-0.2-0.7c0-0.3,0-0.6,0.1-0.9l0.8-5.3
    h-3.6l-1,6c-0.1,0.8-0.1,1.5,0.1,2.1c0.2,0.6,0.5,1,0.9,1.3s1,0.6,1.6,0.7c0.6,0.1,1.3,0.2,2.1,0.2s1.5-0.1,2.1-0.2
    c0.7-0.1,1.3-0.4,1.8-0.7s1-0.8,1.3-1.3c0.4-0.6,0.6-1.2,0.7-2.1l1-6H266.9z M267,129.7l-3.3,3.3l1.4,1.1l3.8-2.8L267,129.7z
    M254,135.7l-0.2,1c-0.2-0.3-0.5-0.5-0.8-0.7s-0.6-0.3-1-0.4c-0.4-0.1-0.7-0.1-1.1-0.1c-0.7,0-1.4,0.2-2.1,0.4
    c-0.7,0.3-1.2,0.7-1.8,1.2c-0.5,0.5-0.9,1.1-1.3,1.7c-0.3,0.6-0.6,1.3-0.7,2c-0.1,0.6-0.1,1.1,0,1.7c0.1,0.5,0.2,1,0.5,1.5
    c0.2,0.4,0.5,0.8,0.9,1.2c0.4,0.3,0.8,0.6,1.3,0.8s1,0.3,1.6,0.3c0.4,0,0.8-0.1,1.2-0.2c0.4-0.1,0.8-0.3,1.1-0.5
    c0.4-0.2,0.7-0.5,0.9-0.8l-0.2,1.1h3.5l1.7-10.2H254z M253.3,140.7c-0.1,0.4-0.2,0.8-0.5,1.1c-0.2,0.3-0.5,0.6-0.9,0.8
    c-0.4,0.2-0.8,0.3-1.3,0.3s-0.9-0.1-1.2-0.3c-0.3-0.2-0.5-0.5-0.6-0.8s-0.2-0.7-0.1-1.1c0.1-0.4,0.2-0.8,0.4-1.1
    c0.2-0.3,0.5-0.6,0.9-0.8c0.5-0.2,0.9-0.3,1.4-0.3s0.9,0.1,1.2,0.3s0.5,0.5,0.6,0.8C253.3,139.9,253.4,140.3,253.3,140.7z
    M243.7,138.3c-0.3-0.3-0.6-0.6-1-0.8c-0.4-0.2-0.9-0.4-1.3-0.5l-0.9-0.3c-0.2-0.1-0.3-0.1-0.5-0.2s-0.3-0.2-0.5-0.3
    c-0.2-0.1-0.3-0.2-0.4-0.4c-0.1-0.2-0.1-0.3-0.1-0.5s0.1-0.4,0.2-0.5c0.1-0.2,0.3-0.3,0.5-0.4c0.2-0.1,0.4-0.2,0.6-0.2
    s0.4-0.1,0.6-0.1c0.5,0,0.9,0.1,1.3,0.3c0.4,0.2,0.8,0.4,1.1,0.7l1.6-3.2c-0.4-0.2-0.8-0.5-1.3-0.6c-0.5-0.2-1-0.3-1.5-0.4
    c-0.5-0.1-1-0.1-1.5-0.1c-0.7,0-1.4,0.1-2.1,0.3c-0.7,0.2-1.2,0.6-1.8,1c-0.5,0.4-1,0.9-1.3,1.5c-0.3,0.6-0.6,1.3-0.7,2
    c-0.1,0.6-0.1,1,0,1.5c0.1,0.4,0.2,0.7,0.4,1c0.2,0.3,0.4,0.5,0.7,0.7s0.6,0.4,1,0.5c0.4,0.1,0.8,0.3,1.3,0.4c0.2,0,0.3,0.1,0.5,0.2
    c0.2,0.1,0.4,0.1,0.6,0.2c0.2,0.1,0.4,0.2,0.5,0.3c0.2,0.1,0.3,0.3,0.4,0.4c0.1,0.2,0.1,0.3,0.1,0.6c0,0.3-0.1,0.5-0.3,0.7
    c-0.1,0.2-0.3,0.3-0.5,0.5l-0.6,0.3c-0.2,0.1-0.5,0.1-0.7,0.1c-0.4,0-0.8-0.1-1.2-0.2c-0.4-0.1-0.7-0.3-1-0.5
    c-0.3-0.2-0.6-0.5-0.9-0.8l-2.1,3.1c0.7,0.5,1.4,0.9,2.2,1.2s1.7,0.4,2.6,0.4c0.5,0,1,0,1.5-0.1c0.5-0.1,1-0.2,1.5-0.4
    c0.5-0.2,0.9-0.5,1.4-0.8c0.4-0.3,0.8-0.7,1.1-1.1c0.3-0.4,0.5-0.9,0.7-1.4c0.2-0.5,0.3-1,0.4-1.5c0.1-0.6,0.1-1.1,0-1.5
    C244.2,139,244,138.6,243.7,138.3z M222.2,135.5l-0.2,1c-0.2-0.3-0.5-0.5-0.8-0.7c-0.3-0.2-0.6-0.3-1-0.4c-0.3-0.1-0.7-0.1-1.1-0.1
    c-0.7,0-1.4,0.1-2.1,0.4s-1.3,0.7-1.8,1.2s-1,1.1-1.3,1.7c-0.4,0.6-0.6,1.3-0.7,2c-0.1,0.6-0.1,1.2,0,1.7c0.1,0.6,0.3,1.1,0.5,1.5
    c0.2,0.5,0.5,0.9,0.9,1.2c0.4,0.4,0.8,0.6,1.3,0.8s1,0.3,1.6,0.3c0.4,0,0.8-0.1,1.2-0.2c0.4-0.1,0.7-0.3,1.1-0.5
    c0.3-0.2,0.6-0.5,0.9-0.8l-0.2,1.1h3.5l1.6-10v-0.2H222.2z M221.4,140.7c-0.1,0.4-0.2,0.8-0.5,1.1c-0.2,0.3-0.5,0.6-0.9,0.8
    c-0.4,0.2-0.8,0.3-1.3,0.3s-0.9-0.1-1.2-0.3c-0.3-0.2-0.5-0.5-0.6-0.8c-0.1-0.3-0.2-0.7-0.1-1.1c0.1-0.4,0.2-0.8,0.4-1.1
    c0.2-0.3,0.5-0.6,0.9-0.8c0.5-0.2,0.9-0.3,1.4-0.3s0.9,0.1,1.2,0.3c0.3,0.2,0.5,0.5,0.6,0.8C221.4,139.9,221.5,140.3,221.4,140.7z
    M210,129.6l-1.1,7.1c-0.2-0.3-0.5-0.5-0.8-0.7s-0.6-0.3-1-0.4c-0.4-0.1-0.7-0.1-1.1-0.1c-0.7,0-1.4,0.2-2.1,0.4
    c-0.7,0.3-1.2,0.7-1.8,1.2c-0.5,0.5-0.9,1.1-1.3,1.7c-0.3,0.6-0.6,1.3-0.7,2c-0.1,0.6-0.1,1.1,0,1.7c0.1,0.5,0.2,1,0.5,1.5
    c0.2,0.4,0.5,0.8,0.9,1.2c0.4,0.3,0.8,0.6,1.3,0.8s1,0.3,1.6,0.3c0.4,0,0.8-0.1,1.2-0.2c0.4-0.1,0.8-0.3,1.1-0.5
    c0.4-0.2,0.7-0.5,0.9-0.8l-0.2,0.9h3.5l2.6-16.1H210z M208.3,140.7c-0.1,0.4-0.2,0.8-0.5,1.1c-0.2,0.3-0.5,0.6-0.9,0.8
    c-0.4,0.2-0.8,0.3-1.3,0.3s-0.9-0.1-1.2-0.3c-0.3-0.2-0.5-0.5-0.6-0.8s-0.2-0.7-0.1-1.1c0.1-0.4,0.2-0.8,0.5-1.1
    c0.2-0.3,0.5-0.6,0.9-0.8c0.4-0.2,0.8-0.3,1.3-0.3s0.9,0.1,1.2,0.3s0.5,0.5,0.6,0.8C208.3,139.9,208.4,140.3,208.3,140.7z
    M191.2,140.3c-0.2-0.2-0.5-0.4-0.8-0.6c-0.3-0.1-0.7-0.3-1.1-0.3c-0.1,0-0.3-0.1-0.4-0.1c-0.2,0-0.3-0.1-0.5-0.1
    c-0.2-0.1-0.3-0.1-0.4-0.2c-0.1-0.1-0.1-0.2-0.1-0.4c0-0.1,0.1-0.2,0.2-0.3c0.1-0.1,0.2-0.2,0.3-0.2c0.1-0.1,0.3-0.1,0.4-0.1h0.4
    c0.2,0,0.4,0,0.6,0.1c0.2,0,0.4,0.1,0.6,0.2l0.6,0.3l1.5-2.6c-0.5-0.2-1-0.4-1.5-0.5s-1.1-0.1-1.7-0.1c-0.4,0-0.9,0-1.3,0.1
    c-0.4,0.1-0.9,0.2-1.3,0.4c-0.4,0.2-0.8,0.4-1.1,0.7c-0.3,0.3-0.6,0.6-0.8,1c-0.2,0.4-0.4,0.8-0.5,1.3c-0.1,0.4-0.1,0.8,0,1.1
    s0.2,0.6,0.4,0.7c0.2,0.2,0.4,0.4,0.6,0.5c0.2,0.1,0.5,0.2,0.8,0.3s0.5,0.1,0.8,0.2c0.3,0.1,0.5,0.1,0.7,0.2
    c0.2,0.1,0.3,0.2,0.5,0.3c0.1,0.1,0.1,0.3,0.1,0.5s-0.1,0.3-0.3,0.4c-0.1,0.1-0.3,0.2-0.5,0.2c-0.2,0-0.3,0.1-0.5,0.1
    c-0.3,0-0.6-0.1-0.9-0.1c-0.3-0.1-0.6-0.2-0.9-0.4c-0.3-0.2-0.6-0.3-0.8-0.5l-1.7,2.5c0.5,0.4,1.1,0.7,1.8,0.8
    c0.6,0.2,1.3,0.3,2,0.3c0.5,0,0.9,0,1.4-0.1c0.5-0.1,0.9-0.2,1.3-0.4c0.4-0.2,0.8-0.4,1.2-0.7s0.6-0.6,0.9-1
    c0.2-0.4,0.4-0.9,0.5-1.4c0.1-0.5,0.1-0.9,0-1.2C191.6,140.9,191.4,140.6,191.2,140.3z M179,135.7l-0.2,1c-0.2-0.3-0.5-0.5-0.8-0.7
    s-0.6-0.3-1-0.4c-0.4-0.1-0.7-0.1-1.1-0.1c-0.7,0-1.4,0.2-2.1,0.4c-0.7,0.3-1.2,0.7-1.8,1.2c-0.5,0.5-0.9,1.1-1.3,1.7
    c-0.3,0.6-0.6,1.3-0.7,2c-0.1,0.6-0.1,1.1,0,1.7c0.1,0.5,0.2,1,0.5,1.5c0.2,0.4,0.5,0.8,0.9,1.2c0.4,0.3,0.8,0.6,1.3,0.8
    s1,0.3,1.6,0.3c0.4,0,0.8-0.1,1.2-0.2c0.4-0.1,0.8-0.3,1.1-0.5c0.4-0.2,0.7-0.5,0.9-0.8l-0.2,1.1h3.5l1.7-10.2H179z M178.2,140.7
    c-0.1,0.4-0.2,0.8-0.4,1.1s-0.5,0.6-0.9,0.8c-0.4,0.2-0.8,0.3-1.3,0.3s-0.9-0.1-1.2-0.3c-0.3-0.2-0.5-0.5-0.6-0.8s-0.2-0.7-0.1-1.1
    c0.1-0.4,0.2-0.8,0.5-1.1c0.2-0.3,0.5-0.6,0.9-0.8c0.3-0.2,0.7-0.3,1.2-0.3s0.9,0.1,1.2,0.3s0.5,0.5,0.6,0.8
    C178.2,139.9,178.3,140.3,178.2,140.7z M170,130.9c-0.1-0.3-0.3-0.5-0.6-0.7c-0.3-0.2-0.7-0.3-1-0.3c-0.4,0-0.7,0.1-1,0.3
    c-0.3,0.2-0.6,0.4-0.8,0.7c-0.2,0.3-0.4,0.6-0.4,1c-0.1,0.4,0,0.7,0.1,1c0.1,0.3,0.3,0.5,0.6,0.7c0.3,0.2,0.6,0.3,1,0.3
    c0.4,0,0.7-0.1,1-0.3c0.3-0.2,0.6-0.4,0.8-0.7c0.2-0.3,0.4-0.6,0.4-1C170.2,131.5,170.1,131.2,170,130.9z M165.7,135.7l-1.6,10h3.5
    l1.6-10H165.7z M158.8,139.8c0.2-0.3,0.4-0.6,0.6-0.8c0.3-0.2,0.5-0.4,0.9-0.5c0.3-0.1,0.6-0.2,1-0.2c0.3,0,0.7,0.1,0.9,0.2
    c0.3,0.1,0.5,0.3,0.8,0.5l0.4-3c-0.3-0.2-0.7-0.3-1.1-0.4c-0.4-0.1-0.8-0.1-1.2-0.1c-0.8,0-1.5,0.1-2.3,0.4
    c-0.7,0.3-1.4,0.6-1.9,1.1c-0.6,0.5-1.1,1.1-1.5,1.7c-0.4,0.7-0.6,1.4-0.8,2.2c-0.1,0.8-0.1,1.5,0.1,2.1c0.2,0.6,0.5,1.2,0.9,1.6
    c0.4,0.5,0.9,0.8,1.6,1.1c0.6,0.3,1.3,0.4,2,0.4c0.4,0,0.9,0,1.3-0.1c0.4-0.1,0.9-0.2,1.3-0.4l0.5-3c-0.2,0.1-0.4,0.3-0.6,0.4
    c-0.2,0.1-0.4,0.2-0.6,0.2c-0.2,0.1-0.4,0.1-0.6,0.1c-0.5,0-0.9-0.1-1.2-0.3s-0.6-0.5-0.7-0.9c-0.2-0.4-0.2-0.8-0.1-1.3
    C158.6,140.5,158.7,140.1,158.8,139.8z M152.7,136.5c-0.2-0.4-0.6-0.6-1-0.8c-0.4-0.2-1-0.3-1.7-0.3c-0.5,0-0.9,0-1.3,0.2
    c-0.4,0.1-0.8,0.3-1.1,0.5c-0.4,0.2-0.7,0.6-1,1l0.4-1.4h-3.5l-1.6,10h3.5l0.8-5.2c0-0.3,0.1-0.6,0.2-0.9c0.1-0.3,0.2-0.5,0.4-0.7
    c0.2-0.2,0.4-0.4,0.6-0.5c0.3-0.1,0.6-0.2,0.9-0.2s0.6,0.1,0.8,0.2c0.2,0.1,0.3,0.3,0.4,0.5c0.1,0.2,0.1,0.4,0.1,0.6s0,0.5-0.1,0.7
    c0,0.2-0.1,0.4-0.1,0.6l-0.8,4.9h3.5l1-6.2c0.1-0.6,0.1-1.2,0.1-1.7C153.1,137.3,153,136.9,152.7,136.5z M140.8,138
    c-0.3-0.8-0.8-1.5-1.6-1.9c-0.7-0.4-1.7-0.7-2.8-0.7c-0.8,0-1.6,0.1-2.3,0.4c-0.7,0.2-1.4,0.6-1.9,1c-0.6,0.5-1,1-1.4,1.7
    s-0.6,1.4-0.8,2.2c-0.1,0.9-0.1,1.6,0.1,2.3s0.5,1.2,0.9,1.7c0.4,0.5,1,0.8,1.7,1c0.7,0.2,1.4,0.3,2.2,0.3c0.6,0,1.1-0.1,1.7-0.2
    c0.6-0.1,1.1-0.3,1.6-0.6s1-0.6,1.4-1.1c0.4-0.4,0.7-0.9,1-1.5h-3.4c-0.2,0.3-0.5,0.6-0.8,0.7c-0.3,0.1-0.6,0.2-1,0.2
    c-0.7,0-1.3-0.2-1.6-0.6c-0.3-0.4-0.4-0.9-0.3-1.7h7.4l0.1-0.3C141.2,139.8,141.1,138.8,140.8,138z M133.9,139.2
    C133.9,139.2,133.9,139.3,133.9,139.2L133.9,139.2L133.9,139.2c0.1-0.3,0.3-0.5,0.5-0.8c0.2-0.2,0.5-0.4,0.8-0.5
    c0.3-0.1,0.6-0.2,1-0.2c0.3,0,0.6,0.1,0.9,0.2c0.3,0.1,0.5,0.3,0.6,0.5c0.2,0.2,0.2,0.5,0.3,0.8H133.9z M137.3,129.6l-4.8,3.2
    l1.2,1.6l3.1-2.2l2.5,2.2l1.8-1.6L137.3,129.6z M130,130.9c-0.1-0.3-0.3-0.5-0.6-0.7c-0.3-0.2-0.6-0.3-1-0.3c-0.4,0-0.7,0.1-1,0.3
    c-0.3,0.2-0.6,0.4-0.8,0.7c-0.2,0.3-0.4,0.6-0.4,1c-0.1,0.4,0,0.7,0.1,1c0.1,0.3,0.3,0.5,0.6,0.7c0.3,0.2,0.6,0.3,1,0.3
    c0.4,0,0.7-0.1,1-0.3c0.3-0.2,0.6-0.4,0.8-0.7c0.2-0.3,0.4-0.6,0.4-1C130.2,131.5,130.1,131.2,130,130.9z M125.7,135.7l-1.6,10h3.5
    l1.6-10H125.7z M122.5,130.9c-0.6-0.1-1.1-0.2-1.7-0.2c-0.7,0-1.4,0.1-2.1,0.3c-0.7,0.2-1.4,0.5-2,0.8c-0.7,0.4-1.3,0.8-1.8,1.3
    s-1,1-1.4,1.6c-0.4,0.6-0.7,1.2-1,1.8s-0.5,1.3-0.6,2c-0.2,1.1-0.1,2.1,0.1,3s0.7,1.8,1.4,2.5c0.4,0.5,0.9,0.9,1.5,1.2
    c0.5,0.3,1.1,0.6,1.7,0.7c0.6,0.2,1.3,0.3,2,0.3c0.4,0,0.8,0,1.1-0.1c0.4-0.1,0.7-0.1,1.1-0.2c0.4-0.1,0.8-0.2,1.2-0.4l0.7-4.6
    c-0.3,0.3-0.7,0.6-1.1,0.8c-0.4,0.2-0.8,0.4-1.2,0.5c-0.4,0.1-0.8,0.2-1.3,0.2c-0.6,0-1.1-0.1-1.6-0.3c-0.5-0.2-0.8-0.5-1.1-0.8
    c-0.3-0.4-0.5-0.8-0.6-1.3s-0.1-1,0-1.6c0.1-0.6,0.3-1.1,0.5-1.6c0.3-0.5,0.6-0.9,1-1.3s0.9-0.7,1.4-0.9c0.5-0.2,1.1-0.3,1.6-0.3
    c0.4,0,0.9,0.1,1.2,0.2c0.4,0.1,0.7,0.3,1.1,0.5c0.3,0.2,0.6,0.5,0.8,0.9l0.7-4.5C123.6,131.2,123,131,122.5,130.9z M103.5,138.1
    c-0.3-0.8-0.9-1.5-1.6-1.9c-0.7-0.5-1.6-0.7-2.8-0.7c-0.8,0-1.6,0.2-2.3,0.4c-0.7,0.2-1.3,0.5-1.9,1c-0.6,0.5-1,1-1.4,1.7
    c-0.4,0.6-0.7,1.4-0.8,2.2c-0.1,0.9-0.1,1.6,0.1,2.3c0.1,0.7,0.5,1.3,0.9,1.7c0.5,0.4,1,0.8,1.7,1c0.6,0.2,1.4,0.3,2.2,0.3
    c0.6,0,1.1-0.1,1.7-0.2c0.6-0.1,1.1-0.3,1.6-0.6s1-0.7,1.4-1.1c0.4-0.4,0.8-0.9,1-1.5h-3.4c-0.2,0.3-0.5,0.6-0.8,0.7
    c-0.3,0.1-0.6,0.2-1,0.2c-0.8,0-1.3-0.2-1.6-0.6s-0.4-1-0.3-1.7h7.4l0.1-0.4C103.9,139.8,103.9,138.8,103.5,138.1z M96.6,139.2
    c0.1-0.3,0.3-0.5,0.5-0.8c0.2-0.2,0.5-0.4,0.8-0.5c0.3-0.1,0.6-0.2,1-0.2c0.3,0,0.6,0.1,0.9,0.2c0.3,0.1,0.5,0.3,0.6,0.5
    c0.2,0.2,0.2,0.5,0.3,0.8H96.6z M96.6,139.2L96.6,139.2C96.6,139.3,96.6,139.2,96.6,139.2L96.6,139.2z M89.6,129.6l-1.1,7.1
    c-0.2-0.3-0.5-0.5-0.8-0.7c-0.3-0.2-0.6-0.3-1-0.4c-0.4-0.1-0.7-0.1-1.1-0.1c-0.7,0-1.4,0.2-2.1,0.4c-0.7,0.3-1.2,0.7-1.8,1.2
    c-0.5,0.5-0.9,1.1-1.3,1.7c-0.3,0.6-0.6,1.3-0.7,2c-0.1,0.6-0.1,1.1,0,1.7c0.1,0.5,0.2,1,0.4,1.5c0.2,0.4,0.5,0.8,0.9,1.2
    c0.4,0.3,0.8,0.6,1.3,0.8s1,0.3,1.6,0.3c0.4,0,0.8-0.1,1.2-0.2c0.4-0.1,0.8-0.3,1.1-0.5c0.4-0.2,0.7-0.5,0.9-0.8l-0.1,0.9h3.5
    l2.6-16.1H89.6z M87.9,140.7c-0.1,0.4-0.2,0.8-0.4,1.1s-0.5,0.6-0.9,0.8c-0.4,0.2-0.8,0.3-1.3,0.3s-0.9-0.1-1.2-0.3
    c-0.3-0.2-0.5-0.5-0.6-0.8c-0.1-0.3-0.2-0.7-0.1-1.1c0.1-0.4,0.2-0.8,0.5-1.1c0.2-0.3,0.5-0.6,0.9-0.8c0.3-0.2,0.7-0.3,1.2-0.3
    s0.9,0.1,1.2,0.3c0.3,0.2,0.5,0.5,0.6,0.8C87.9,139.9,88,140.3,87.9,140.7z M72,138.9c-0.1-0.6-0.3-1.1-0.6-1.5
    c-0.3-0.4-0.7-0.8-1.1-1.1c-0.5-0.3-1-0.5-1.5-0.7c-0.7-0.1-1.3-0.2-2-0.2c-0.6,0-1.3,0.1-1.9,0.2c-0.6,0.2-1.2,0.4-1.7,0.7
    c-0.6,0.3-1,0.7-1.5,1.1c-0.4,0.4-0.8,0.9-1.1,1.5c-0.3,0.6-0.5,1.2-0.6,1.9c-0.1,0.7-0.1,1.3,0,1.9c0.1,0.6,0.3,1.1,0.6,1.5
    c0.3,0.4,0.7,0.8,1.2,1.1s1,0.5,1.5,0.7c0.6,0.2,1.2,0.2,1.8,0.2c0.6,0,1.3-0.1,1.9-0.2c0.6-0.2,1.2-0.4,1.8-0.7
    c0.5-0.3,1-0.7,1.5-1.1c0.4-0.4,0.8-0.9,1.1-1.5c0.3-0.6,0.5-1.2,0.6-1.9C72.1,140.1,72.1,139.5,72,138.9z M68.3,140.7
    c-0.1,0.4-0.2,0.8-0.4,1.1c-0.2,0.3-0.5,0.6-0.9,0.8c-0.4,0.2-0.8,0.3-1.3,0.3s-0.9-0.1-1.2-0.3c-0.3-0.2-0.5-0.5-0.6-0.8
    c-0.1-0.3-0.2-0.7-0.1-1.1c0.1-0.4,0.2-0.8,0.5-1.1c0.2-0.3,0.5-0.6,0.9-0.8c0.2-0.2,0.7-0.3,1.2-0.3s0.9,0.1,1.2,0.3
    s0.5,0.5,0.6,0.8C68.3,139.9,68.4,140.3,68.3,140.7z M59.8,135.6c-0.6,0-1.3,0.1-1.9,0.4c-0.6,0.2-1.2,0.7-1.6,1.3l0.3-1.6v-0.1
    h-3.5l-1.6,10H55l0.6-4l0.3-1.2c0.1-0.4,0.3-0.7,0.5-1l0.9-0.6c0.3-0.1,0.7-0.2,1.2-0.2c0.3,0,0.6,0.1,0.8,0.1
    c0.3,0.1,0.5,0.2,0.7,0.3l0.5-3.4H59.8z M50,135.7l0.5-3H47l-0.5,3h-1.1l-0.5,2.9H46l-1.1,7.1h3.5l1.1-7.1h2l0.5-2.9H50z
    M42.5,136.5c-0.2-0.4-0.6-0.6-1-0.8c-0.4-0.2-1-0.3-1.7-0.3c-0.5,0-0.9,0-1.3,0.2c-0.4,0.1-0.8,0.3-1.1,0.5c-0.4,0.2-0.7,0.6-1,1
    l0.3-1.4h-3.5l-1.6,10h3.5l0.8-5.2c0.1-0.3,0.1-0.6,0.2-0.9c0.1-0.3,0.2-0.5,0.4-0.7c0.2-0.2,0.4-0.4,0.6-0.5
    c0.3-0.1,0.6-0.2,0.9-0.2s0.6,0.1,0.8,0.2c0.2,0.1,0.3,0.3,0.4,0.5c0.1,0.2,0.1,0.4,0.1,0.6v0.7c0,0.2-0.1,0.4-0.1,0.6l-0.8,4.9h3.5
    l1-6.2c0.1-0.6,0.1-1.2,0.1-1.7C42.9,137.3,42.8,136.9,42.5,136.5z M30.6,138.1c-0.3-0.8-0.9-1.5-1.6-1.9c-0.7-0.5-1.6-0.7-2.8-0.7
    c-0.8,0-1.6,0.2-2.3,0.4c-0.7,0.2-1.3,0.5-1.9,1c-0.6,0.5-1,1-1.4,1.7c-0.4,0.6-0.7,1.4-0.8,2.2c-0.1,0.9-0.1,1.6,0.1,2.3
    c0.1,0.7,0.5,1.3,0.9,1.7c0.5,0.4,1,0.8,1.7,1c0.6,0.2,1.4,0.3,2.2,0.3c0.6,0,1.1-0.1,1.7-0.2c0.6-0.1,1.1-0.3,1.6-0.6
    c0.6-0.3,1-0.7,1.4-1.1c0.4-0.4,0.8-0.9,1-1.5H27c-0.2,0.3-0.5,0.6-0.8,0.7c-0.3,0.1-0.6,0.2-1,0.2c-0.8,0-1.3-0.2-1.6-0.6
    s-0.4-1-0.3-1.7h7.4l0.1-0.4C30.9,139.8,30.9,138.8,30.6,138.1z M23.6,139.2c0.1-0.3,0.3-0.5,0.5-0.8c0.2-0.2,0.5-0.4,0.8-0.5
    c0.3-0.1,0.6-0.2,1-0.2c0.3,0,0.6,0.1,0.9,0.2c0.3,0.1,0.5,0.3,0.6,0.5c0.2,0.2,0.2,0.5,0.3,0.8H23.6z M23.6,139.2L23.6,139.2
    C23.6,139.3,23.6,139.2,23.6,139.2L23.6,139.2z M18.2,130.9c-0.6-0.1-1.1-0.2-1.7-0.2c-0.7,0-1.4,0.1-2.1,0.3
    c-0.7,0.2-1.4,0.5-2,0.8c-0.7,0.4-1.3,0.8-1.8,1.3s-1,1-1.4,1.6c-0.4,0.6-0.7,1.2-1,1.8c-0.3,0.6-0.5,1.3-0.6,2
    c-0.2,1.1-0.1,2.1,0.1,3c0.2,0.9,0.7,1.8,1.4,2.5c0.4,0.5,0.9,0.9,1.5,1.2c0.5,0.3,1.1,0.6,1.7,0.7c0.6,0.2,1.3,0.3,2,0.3
    c0.4,0,0.8,0,1.1-0.1c0.4-0.1,0.7-0.1,1.1-0.2c0.4-0.1,0.8-0.2,1.2-0.4l0.7-4.6c-0.3,0.3-0.7,0.6-1.1,0.8s-0.8,0.4-1.2,0.5
    c-0.4,0.1-0.8,0.2-1.3,0.2c-0.6,0-1.1-0.1-1.6-0.3c-0.5-0.2-0.8-0.5-1.1-0.8c-0.3-0.4-0.5-0.8-0.6-1.3c-0.1-0.5-0.1-1,0-1.6
    c0.1-0.6,0.3-1.1,0.5-1.6c0.3-0.5,0.6-0.9,1-1.3c0.4-0.4,0.9-0.7,1.4-0.9c0.5-0.2,1.1-0.3,1.6-0.3c0.4,0,0.9,0.1,1.2,0.2
    c0.4,0.1,0.7,0.3,1.1,0.5c0.3,0.2,0.6,0.5,0.8,0.9l0.7-4.5C19.3,131.2,18.7,131,18.2,130.9z"/>
  </svg>
`;

const nomeAmigavelAtividadesEnsinoTipo = tipo => {
  switch (tipo) {
    case 'prep-aula':
      return 'Preparação de aulas';
    case 'coord-disc':
      return 'Coordenação de disciplinas';
    case 'correcao-prova':
      return 'Correção de provas';
    case 'atendimento-extra-classe':
      return 'Atendimento extra-classe';
    case 'correcao-tese':
      return 'Correção monograf/diss/tese';
    case 'participacao-bancas':
      return 'Participação em bancas (membro ou revisor)';
    case 'atividades-fora':
      return 'Atividades fora da sede';
    case 'outros':
      return 'Outros';
    default:
      break;
  }
};

const nomeAmigavelAtividadesPesquisaTipo = tipo => {
  switch (tipo) {    
    case 'prep-proj':
      return 'Prep. de proj. editais de financiamento';
    case 'pareceres-fomento':
      return 'Pareceres para órgãos de fomento/revistas científicas';    
    case 'outros':
      return 'Outros';
    default:
      break;
  }
};

const nomeAmigavelAtividadesAdmCargo = cargo => {
  switch (cargo) {    
    case 'adm-sup':
      return 'Administração superior';
    case 'adm-med':
      return 'Administração Média';    
    case 'diretoria':
      return 'Diretoria ou Direção';    
    case 'coordenacao':
      return 'Coordenação';    
    case 'chefia':
      return 'Chefia';    
    case 'comissao':
      return 'Participação em Comissões';    
    case 'outros':
      return 'Atividades Administrativas de outra natureza';
    default:
      return 'Atividades Administrativas de outra natureza';
  }
};

const inserirCargaHorariaDOM = (CH, body, planidElement) => {  
  planidElement.querySelector('.planid-impresso__header__docente-id__ch').insertAdjacentHTML('beforeend', `${CH.total.toFixed(1)}h`)
  const CHParcial = Object.entries(CH.parcial);
  for (let i = 0; i < CHParcial.length; i++) {
    body.querySelector(`.ch-parcial-${CHParcial[i][0]}`).insertAdjacentHTML('beforeend', `CH semanal: ${CHParcial[i][1].toFixed(1)}h`);
  }
};

const imprimirHeader = planid => {  
  const header = document.createElement('div');
  header.classList.add('planid-impresso__header');  
  const headerHTML = `
    <div class='planid-impresso__header__unidade-id'>
      <div class='marca-ufrj__container'>
          <img class='marca-ufrj' src='/img/ufrj100AnosBlackText.png'>
        </div>
        <div class='identificacao-instituicao'>
          <h3>CENTRO DE CIÊNCIAS DA SAÚDE</h3>
          <h3>${unidade.split(' (')[0]}</h3>
        </div>
        <div class='marca-ccs'>
          ${marcaCCS}
        </div>
      </div>
      <div class='planid-impresso__header__planid-id'>
        <h2 class='identificacao-planid'>PLANO INDIVIDUAL DE ATIVIDADES DOCENTES | ${planid.semestre}</h2>      
      </div>
      <div class='planid-section'>
        <h2>Identificação</h2>
      </div>
      <div class='planid-impresso__header__docente-id'>
        <div class='planid-impresso__header__docente-id__linha'>
          <div class='planid-impresso__header__docente-id__nome'>
            <span class='titulo'>Nome: </span>
            ${planid.autor.nome}
          </div>
          <div class='planid-impresso__header__docente-id__classe'>
            <span class='titulo'>Classe: </span>
            ${planid.autor.classe}
          </div>
          <div class='planid-impresso__header__docente-id__programa'>
            <span class='titulo'>Departamento/programa: </span>
            ${planid.autor.departamento}
          </div>
          <div class='planid-impresso__header__docente-id__ch'>
            <span class='titulo'>Carga horária total: </span>
            
          </div>
        </div>
        <div class='planid-impresso__header__docente-id__linha'>
          <div class='planid-impresso__header__docente-id__titulacao'>
            <span class='titulo'>Titulacao:</span>
            ${planid.autor.titulacao}
          </div>
          <div class='planid-impresso__header__docente-id__identificacao'>
            <span class='titulo'>SIAPE: </span>
            ${planid.autor.identificacao}
          </div>
          <div class='planid-impresso__header__docente-id__vinculo'>
            <span class='titulo'>Vínculo: </span>
            ${planid.autor.vinculo}
          </div>
          <div class='planid-impresso__header__docente-id__regime'>
            <span class='titulo'>Regime de trabalho: </span>
            ${planid.autor.regime.toUpperCase()}
          </div>
        </div>

      </div>
    </div>
  `;  
 
  header.insertAdjacentHTML('beforeend', headerHTML);
  return header;
};

const imprimirBody = (planids, planidElement) => {  
  const body = document.createElement('div');
  body.classList.add('planid-impresso__body');
  const sectionsArr = Object.entries(sections);
  for (let i = 0; i < sectionsArr.length; i++) {
    const subSecoes = sectionsArr[i][1];
    const nomeSecao = sectionNames[`${sectionsArr[i][0]}`];
    const secao = document.createElement('div');
    secao.classList.value = `planid-section ${sectionsArr[i][0]}`;
    secao.insertAdjacentHTML('beforeend', `<div class='section-title-print'><h2>${nomeSecao}</h2><span class='ch-parcial-dom ch-parcial-${sectionsArr[i][0]}'></span></div>`);
    for (let j = 0; j < subSecoes.length; j++) {
      const campos = containers[subSecoes[j]];
      const subSecao = document.createElement('div');      
      subSecao.classList.value = `sub-secao ${subSecoes[j]}`;
      subSecao.insertAdjacentHTML('beforeend', `<h3>${nomesAmigaveis[subSecoes[j]]}</h3>`);
      const camposDOM = document.createElement('div');
      camposDOM.classList.value = `planid-campos campos-${subSecoes[j]}`;
      const camposHeaderDOM = document.createElement('div');
      camposHeaderDOM.classList.value = `planid-campos__header campos-${subSecoes[j]}__header`;
      camposDOM.insertAdjacentElement('beforeend', camposHeaderDOM);
      for (let k = 0; k < campos.length; k++) {          
        if (!camposNaoListados.includes(campos[k])) {
          const html = `<h4 class='campo__${campos[k]}'>${nomesAmigaveis[campos[k]]}</h4> `;
          camposHeaderDOM.insertAdjacentHTML('beforeend', html);
        }        
      }
      subSecao.insertAdjacentElement('beforeend', camposDOM);    
      secao.insertAdjacentElement('beforeend', subSecao);
    }
    body.insertAdjacentElement('beforeend', secao);
  }  

  const containerArr = Object.entries(containers);  
  for (let i = 0; i < containerArr.length; i++) {    
    if (planids[containerArr[i][1][0]].length) {      
      for (let j = 0; j < planids[containerArr[i][1][0]].length; j++) {
        const atividade = document.createElement('div');
        atividade.classList.value = `planid-campos__atividade atividade-${containerArr[i][0]}`;
        for (let k = 0; k < containerArr[i][1].length; k++) {          
          if (!camposNaoListados.includes(containerArr[i][1][k])) {            
            if (containerArr[i][1][k].includes('CH')) {                 
              if (CHSemestrais.includes(containerArr[i][1][k])) {
                //if (planids.autor.unidadePreenchimentoPlanid === 'Faculdade de Medicina (FM)') {
                  //planids[containerArr[i][1][k]][j] = planids[containerArr[i][1][k]][j] / semanasAulaMedicina;
                //} else {
                  planids[containerArr[i][1][k]][j] = planids[containerArr[i][1][k]][j] / semanasAula;
                //}
              }
              computarCargasHorariasParciais(containerArr[i][1][k], +planids[containerArr[i][1][k]][j]);
            }
            if (containerArr[i][1][k] === 'disciplina') {
              atividade.innerHTML += `<span class='campo__${containerArr[i][1][k]}'>${planids[containerArr[i][1][k]][j].split(' -- ')[0]}</span>`;
            } else if (containerArr[i][1][k].includes('CH')) {
              atividade.innerHTML += `<span class='campo__${containerArr[i][1][k]}'>${Number(planids[containerArr[i][1][k]][j]).toFixed(1)}</span>`;
            } else if (containerArr[i][1][k] === 'atividadesComplementaresEnsinoTipo') {
              atividade.innerHTML += `<span class='campo__${containerArr[i][1][k]}'>${nomeAmigavelAtividadesEnsinoTipo(planids[containerArr[i][1][k]][j])}</span>`;
            } else if (containerArr[i][1][k] === 'atividadesComplementaresPesquisaTipo') {
              atividade.innerHTML += `<span class='campo__${containerArr[i][1][k]}'>${nomeAmigavelAtividadesPesquisaTipo(planids[containerArr[i][1][k]][j])}</span>`;
            } else if (containerArr[i][1][k] === 'atividadesAdmCargo') {
              atividade.innerHTML += `<span class='campo__${containerArr[i][1][k]}'>${nomeAmigavelAtividadesAdmCargo(planids[containerArr[i][1][k]][j])}</span>`;
            } else {
              atividade.innerHTML += `<span class='campo__${containerArr[i][1][k]}'>${planids[containerArr[i][1][k]][j] || '-'}</span>`;
            }
          }
          // imprimindo campos do tipo "outros"          
          if (
            (containerArr[i][1][k] === 'projetosPesqFinanciadorOutro' && planids[containerArr[i][1][k]][j] !== '-') ||
            (containerArr[i][1][k] === 'acoesTipoAcaoOutros' && planids[containerArr[i][1][k]][j] !== '-')
          ) {
            atividade.querySelector(`.campo__${containerArr[i][1][k - 1]}`).innerHTML = planids[containerArr[i][1][k]][j];
          } 
        }
        body.querySelector(`.campos-${containerArr[i][0]}`).insertAdjacentElement('beforeend', atividade);
      }
    } else {
      body.querySelector(`.campos-${containerArr[i][0]}`).classList.add('sem-atividades');
      body.querySelector(`.campos-${containerArr[i][0]}`).innerHTML = '<div>Sem atividades registradas</div>'
    }
  }  
  inserirCargaHorariaDOM(cargasHorariasParciais, body, planidElement);
  return body;
};

const imprimirFooter = planids => {
  const footer = document.createElement('div');
  footer.classList.add('planid-impresso__footer');
  const comentariosGerais = planids.comentariosGerais ? `
    <div class='planid-section section-observacoes-gerais'>
      <h2>Comentários gerais</h2>      
    </div>
    <div class='planid-impresso__footer__observacoes-gerais'>
      ${planids.comentariosGerais}
    </div>
  ` : ''
  const footerHTML = comentariosGerais;
  footer.innerHTML = footerHTML;
  return footer;
};

const adicionarIconeImpressao = () => {
  const printBtn = '<div class="impressao-planid-div"><i class="fa fa-print icone-imprimir"></i></div>'
  document.querySelector(`.planids-impressos`).insertAdjacentHTML('afterend', printBtn);
  document.querySelector(`.impressao-planid-div`).addEventListener('click', () => {
    print();
  });
};

const imprimirPlanids = planids => {  
  let fileName;
  if (planids.length === 1) {
    fileName = planids[0].autor.nome;
  } else {
    fileName = unidade;
  }
  //document.getElementsByTagName("title")[0].innerHTML = `Planids ${semestreImpressao} | ${fileName}`;  
  const impressos = document.createElement('div');
  impressos.classList.add('planids-impressos')
  for (let i = 0; i < planids.length; i++) {
    cargasHorariasParciais = {
      total: 0,
      parcial: {
        section_2: 0,
        section_3: 0,
        section_4: 0,
        section_5: 0,
      }
    };
  
    const planid = document.createElement('div');
    planid.classList.add('planid-impresso');
    planid.insertAdjacentElement('beforeend', imprimirHeader(planids[i]));
    planid.insertAdjacentElement('beforeend', imprimirBody(planids[i], planid));
    planid.insertAdjacentElement('beforeend', imprimirFooter(planids[i]));
    impressos.insertAdjacentElement('beforeend', planid)
  }  
  document.querySelector(`.planid-impressao`).insertAdjacentElement('beforeend', impressos);
  variaveisGlobais.controlarVisibilidade('ocultar', '#mensagens-genericas');  
  adicionarIconeImpressao();
};

const carregarPlanid = async () => {  
  let query = {};  
  let queryUnidade = {$or:[{'autor.unidadePreenchimentoPlanid': 'unidadeLotacao', 'autor.unidadeLotacao': unidade}, {'autor.unidadePreenchimentoPlanid': 'unidadeLocalizacao', 'autor.unidadeLocalizacao': unidade}]}
  
  query.query = _id ? JSON.stringify({_id, semestre: semestreImpressao}) : JSON.stringify({enviado: true, semestre: semestreImpressao, ...queryUnidade});
  const planids = await ajax({ url: '/planids/recuperar-planid', method: 'GET', params: { populate: query.populate, query: query.query } });
  return planids;
};

const rotinasImpressao = async () => {
  operacaoDB();
  const planids = await carregarPlanid();
  if (!planids.data.length) {
    variaveisGlobais.exibirMensagem('<h3>Não foi encontrado o planid selecionado. Favor informar o ocorrido à Assessoria de Desenvolvimento WEB do CCS, utilizando nossa <a target="_blank" rel="noopener noreferrer" href="/fale-conosco?form=reportar-problema">central de atendimento</a></h3>');
  } else {
    imprimirPlanids(planids.data);
  }  
};
rotinasImpressao();