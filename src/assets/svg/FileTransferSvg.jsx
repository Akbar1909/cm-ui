import React from 'react';

const FileTransferSvg = ({ fill }) => {
  return (
    <svg width="19" height="22" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 11.5678C15.34 11.5678 15.67 11.6071 16 11.6563V6.65092L10 0.750656H2C0.89 0.750656 0 1.62586 0 2.71741V18.4515C0 19.543 0.89 20.4182 2 20.4182H9.81C9.3 19.5528 9 18.5498 9 17.4681C9 14.2131 11.69 11.5678 15 11.5678ZM9 2.22572L14.5 7.6343H9V2.22572ZM16 17.9598V16.4847H12V14.5179H16V13.0429L19 15.5013L16 17.9598ZM14 18.4515H18V20.4182H14V21.8933L11 19.4348L14 16.9764V18.4515Z"
        fill={fill}
      />
    </svg>
  );
};

export default FileTransferSvg;
