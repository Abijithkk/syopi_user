import React, { useEffect, useState, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle } from "lucide-react";
import './LeavePageConfirmation.css';

const LeavePageConfirmation = ({ hasUnsavedChanges = true }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    const handlePopState = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        setPendingNavigation({ type: 'back' });
        setShowDialog(true);
        window.history.pushState(null, '', location.pathname);
      }
    };

    const handleClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.href.startsWith(window.location.origin) && hasUnsavedChanges) {
        e.preventDefault();
        setPendingNavigation({ type: 'path', path: link.pathname, event: e });
        setShowDialog(true);
      }
    };
    

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleClick);
    
    window.history.pushState(null, '', location.pathname);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick);
    };
  }, [hasUnsavedChanges, location.pathname]);

  const handleConfirm = () => {
    if (pendingNavigation?.type === 'back') {
      navigate(-1);
    } else if (pendingNavigation?.type === 'path') {
      navigate(pendingNavigation.path);
    }
    setShowDialog(false);
    setPendingNavigation(null);
  };

  const handleCancel = () => {
    setShowDialog(false);
    setPendingNavigation(null);
  };

  return (
    <Transition show={showDialog} as={Fragment}>
      <Dialog 
        as="div" 
        className="lpc-modal-container"
        onClose={handleCancel}
      >
        <Transition.Child
          as={Fragment}
          enter="lpc-fade-enter"
          enterFrom="lpc-fade-enter"
          enterTo="lpc-fade-enter-active"
          leave="lpc-fade-exit"
          leaveFrom="lpc-fade-exit"
          leaveTo="lpc-fade-exit-active"
        >
          <div className="lpc-modal-overlay" />
        </Transition.Child>

        <div className="lpc-modal-content-wrapper">
          <Transition.Child
            as={Fragment}
            enter="lpc-slide-enter"
            enterFrom="lpc-slide-enter"
            enterTo="lpc-slide-enter-active"
            leave="lpc-slide-exit"
            leaveFrom="lpc-slide-exit"
            leaveTo="lpc-slide-exit-active"
          >
            <Dialog.Panel className="lpc-modal-panel">
              <div className="lpc-modal-header">
                <AlertTriangle className="lpc-warning-icon" />
                <Dialog.Title className="lpc-modal-title">
                  Unsaved Changes
                </Dialog.Title>
              </div>

              <div className="lpc-modal-body">
                You have unsaved changes that will be lost if you leave this page.
              </div>

              <div className="lpc-modal-footer">
                <button
                  type="button"
                  className="lpc-btn lpc-btn-secondary"
                  onClick={handleCancel}
                >
                  Stay on Page
                </button>
                <button
                  type="button"
                  className="lpc-btn lpc-btn-danger"
                  onClick={handleConfirm}
                >
                  Leave Without Saving
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LeavePageConfirmation;