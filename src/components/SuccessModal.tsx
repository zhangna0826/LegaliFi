import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X, ChevronRight, LayoutDashboard, Eye } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  subMessage?: string;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  details?: { label: string; value: string }[];
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  subMessage,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  details
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-600 mb-1">{message}</p>
              {subMessage && <p className="text-xs text-slate-400 mb-6">{subMessage}</p>}

              {details && (
                <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left space-y-2 border border-slate-100">
                  {details.map((detail, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{detail.label}</span>
                      <span className="text-xs font-bold text-slate-700">{detail.value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={onPrimaryAction}
                  className="w-full py-3 bg-indigo-900 text-white rounded-xl font-bold shadow-xl shadow-indigo-900/20 hover:bg-indigo-950 transition-all flex items-center justify-center gap-2 group"
                >
                  <Eye size={18} />
                  <span>{primaryActionLabel}</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                {secondaryActionLabel && onSecondaryAction && (
                  <button
                    onClick={onSecondaryAction}
                    className="w-full py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard size={18} />
                    <span>{secondaryActionLabel}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
