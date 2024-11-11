import React, { useEffect, useCallback} from "react";

const ModalBackground = ({ children, display, setDisplay }) => {

    const closeWithEsc = useCallback((e)=>{
        if (e.key === 'Escape'){
            setDisplay(false)
        }
    }, [setDisplay])

    useEffect(()=>{
        if (display){
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', closeWithEsc)
        }
        else{
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', closeWithEsc)
        }

    }, [display])

    return (
        <>
            {display &&
                <div className="modal-background">
                    {children}
                </div>
            }
        </>
    )
}

export default ModalBackground