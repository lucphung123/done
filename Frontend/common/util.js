export function isExpired(dateString) {
  var inputDate = new Date(dateString);
  var today = new Date();

  // Chỉ so sánh ngày, tháng và năm, bỏ qua giờ, phút, giây, mili giây
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return inputDate <= today;
}

export const validatePhone = (phone) => {
  if (phone.length > 10) return false;
  var regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  return regex.test(phone);
};

export const validatePhoneNumber = (phone) => {
  if (phone.length > 15) return false;
  if (phone.startsWith("0")) {
    if (phone.length !== 10) return false;
  }
  // var regex = /((09|03|07|08|05)+([0-9]{8})\b)/g
  const regex = /^(0|\+84|84)[1-9]\d{8,12}$/;
  return regex.test(phone);
};

export const validateEmailD = (mail) => {
  const regex = /^[a-zA-Z0-9_]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/;
  return regex.test(mail);
};

export const validateEmail = (email) => {
  var regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};

export const goTo = (url) => {
  url = window.location.origin + "/" + url;
  window.location.replace(url);
};
const replaceVietnamese = (data) => {
  data = data.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  data = data.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  data = data.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  data = data.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  data = data.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  data = data.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  data = data.replace(/đ/g, "d");
  data = data.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  data = data.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  data = data.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  data = data.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  data = data.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  data = data.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  data = data.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  data = data.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  data = data.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  data = data.replace(/ + /g, " ");
  data = data.trim();
  return data;
};

export const removeVietnameseTones = (data) => {
  let result = replaceVietnamese(data);
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  result = result.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-| |{|}|\||\\/g,
    "-"
  );
  return result;
};
