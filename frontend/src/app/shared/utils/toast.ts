import Swal from 'sweetalert2';

const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timerProgressBar: true,
  background: '#111827',
  color: '#F8FAFC',
});

export const showErrorToast = (message: string, timer = 4000) =>
  toast.fire({
    icon: 'error',
    text: message,
    iconColor: '#EF4444',
    timer,
  });

export const showSuccessToast = (title: string, timer = 2000) =>
  toast.fire({
    icon: 'success',
    title,
    iconColor: '#22C55E',
    timer,
    confirmButtonColor: '#22C55E',
  });
