import Swal from "sweetalert2";

type ConfirmOptions = {
    title?: string;
    text?: string;
    confirmText?: string;
    cancelText?: string;
    icon?: "warning" | "question" | "info" | "success" | "error";
};

export const notifyDialog = async ({
    title = "Are you sure?",
    text = "This action cannot be undone.",
    confirmText = "OK",
    icon = "info",
}: ConfirmOptions = {}) => {
    const result = await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText: confirmText,
        reverseButtons: true,
        focusCancel: true,
        buttonsStyling: false, // ← tambah ini
        customClass: {
            popup: "swal-popup",
            title: "swal-title",
            htmlContainer: "swal-text",
            actions: "swal-actions",
            confirmButton: "swal-confirm",
            cancelButton: "swal-cancel",
        },
    });

    return result.isConfirmed;
};

export const confirmDialog = async ({
    title = "Are you sure?",
    text = "This action cannot be undone.",
    confirmText = "Yes, continue",
    cancelText = "Cancel",
    icon = "warning",
}: ConfirmOptions = {}) => {
    const result = await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        reverseButtons: true,
        focusCancel: true,
        buttonsStyling: false, // ← tambah ini
        customClass: {
            popup: "swal-popup",
            title: "swal-title",
            htmlContainer: "swal-text",
            actions: "swal-actions",
            confirmButton: "swal-confirm",
            cancelButton: "swal-cancel",
        },
    });

    return result.isConfirmed;
};

export const redirectDialog = async ({
    title,
    text,
    confirmText,
    cancelText,
    icon,
}: ConfirmOptions = {}) => {
    const result = await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        reverseButtons: true,
        buttonsStyling: false, // ← tambah ini
        customClass: {
            popup: "swal-popup",
            title: "swal-title",
            htmlContainer: "swal-text",
            actions: "swal-actions",
            confirmButton: "swal-confirm",
            cancelButton: "swal-cancel",
        },
    });

    return result.isConfirmed;
};
