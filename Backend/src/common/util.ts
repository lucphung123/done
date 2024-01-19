function isValidDate(dateString: string): boolean {
	// Kiểm tra độ dài chuỗi đầu vào phải là 10 (vd: "yyyy-mm-dd")
	if (dateString.length !== 10) {
		return false;
	}

	// Kiểm tra định dạng ngày tháng
	const regex = /^\d{4}-\d{2}-\d{2}$/;
	if (!regex.test(dateString)) {
		return false;
	}

	// Kiểm tra tính hợp lệ của ngày tháng
	const year = parseInt(dateString.substring(0, 4));
	const month = parseInt(dateString.substring(5, 7));
	const day = parseInt(dateString.substring(8, 10));
	const date = new Date(year, month - 1, day);
	if (
		date.getFullYear() !== year ||
		date.getMonth() !== month - 1 ||
		date.getDate() !== day
	) {
		return false;
	}

	return true;
}

function compareTasks(a, b): number {
	// So sánh theo deadline
	const deadlineA = new Date(a.deadline);
	const deadlineB = new Date(b.deadline);
	if (deadlineA < deadlineB) {
		return -1;
	} else if (deadlineA > deadlineB) {
		return 1;
	}

	// So sánh theo priority
	if (a.priority < b.priority) {
		return -1;
	} else if (a.priority > b.priority) {
		return 1;
	}

	// So sánh theo status
	const statusOrder = [2, 3, 1];
	const statusIndexA = statusOrder.indexOf(a.status);
	const statusIndexB = statusOrder.indexOf(b.status);
	if (statusIndexA < statusIndexB) {
		return -1;
	} else if (statusIndexA > statusIndexB) {
		return 1;
	}

	return 0;
}

function isExpired(dateString: string): boolean {
	var inputDate = new Date(dateString);
	var today = new Date();

	// Chỉ so sánh ngày, tháng và năm, bỏ qua giờ, phút, giây, mili giây
	inputDate.setHours(0, 0, 0, 0);
	today.setHours(0, 0, 0, 0);

	return inputDate <= today;
}

module.exports = { isValidDate, compareTasks, isExpired };