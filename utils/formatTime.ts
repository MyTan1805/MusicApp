// File: utils/formatTime.ts

export const formatTime = (milliseconds: number): string => {
  if (isNaN(milliseconds) || milliseconds < 0) {
    return '00:00';
  }

  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Thêm '0' vào trước nếu số giây/phút nhỏ hơn 10
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  return `${paddedMinutes}:${paddedSeconds}`;
};