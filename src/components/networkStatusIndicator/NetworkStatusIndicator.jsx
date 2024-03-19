import React from 'react'
import { useNavigatorOnline } from '../../hook/useNavigatorOnline';
import { useRef } from 'react';
import { useLayoutEffect } from 'react';
import Swal from 'sweetalert2';

export default function NetworkStatusIndicator() {
    const isOnline = useNavigatorOnline();
    const firstUpdate = useRef(true);

    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        isOnline
            ? Swal.fire({
                position: "center",
                icon: "success",
                title: "Đã có kết nối mạng",
                showConfirmButton: false,
            }) : Swal.fire({
                position: "center",
                icon: "error",
                title: "Hãy kết nối mạng để tiếp tục",
                showConfirmButton: false,
            })
    }, [isOnline])

    return null;
}
