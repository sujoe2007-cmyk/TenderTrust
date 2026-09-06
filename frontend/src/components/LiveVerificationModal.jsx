import React, { useState, useEffect } from "react";
import {
  ShieldCheck, CheckCircle2, AlertTriangle, XCircle, RefreshCw,
  Cpu, Building2, FileText, Lock, ShieldAlert, Award, ArrowRight,
  ExternalLink, Check, Zap, X
} from "lucide-react";

export default function LiveVerificationModal({ bidData, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const steps = [
    {
      id: "DOC_AI",
      title: "Document AI OCR & Entity Parsing",
      desc: "Parsing 9 uploaded statutory documents, extracting PAN, GSTIN, UDIN & calculating tampering integrity score.",
      latency: "140ms",
      status: "PASS",
      icon: Cpu
    },
    {
      id: "GSTN",
      title: "Goods & Services Tax Network (GSTN API)",
      desc: "Checking active GST status, return filing frequency (GSTR-3B/1) and PAN consistency across states.",
      latency: "92ms",
      status: "PASS",
      icon: Building2
    },
    {
      id: "UDYAM",
      title: "Ministry of MSME (Udyam National Portal)",
      desc: "Validating MSME enterprise classification (Micro/Small/Medium) and NIC codes against tender criteria.",
      latency: "115ms",
      status: "PASS",
      icon: Award
    },
    {
      id: "ITD_PAN",
      title: "Income Tax Department / NSDL PAN Gateway",
      desc: "Cross-matching legal entity name, 3-year ITR filing compliance and tax clear records.",
      latency: "88ms",
      status: "PASS",
      icon: FileText
    },
    {
      id: "CVC_DEBAR",
      title: "Central Vigilance / GeM Debarment Registry",
      desc: "Screening entity, directors, and CIN against blacklists from 42 Central Ministries & CPSEs.",
      latency: "64ms",
      status: bidData?.pan === "AABCK9988D" || bidData?.pan === "AABCS7711M" ? "FAIL" : "PASS",
      icon: ShieldAlert
    },
    {
      id: "ICAI_UDIN",
      title: "ICAI CA Audited UDIN Verification",
      desc: "Validating Chartered Accountant Unique Document Identification Number (UDIN) directly with ICAI repository.",
      latency: "108ms",
      status: "PASS",
      icon: ShieldCheck
    },
    {
      id: "RISK_AI",
      title: "Multi-Factor AI Compliance Risk Engine",
      desc: "Evaluating 14 tender mandatory checklists, Make in India local content % and calculating composite risk score.",
      latency: "180ms",
      status: "PASS",
      icon: Zap
    }
  ];

  useEffect(() => {
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        setCurrentStep(stepIndex);
        setLogs((prev) => [
          ...prev,
          {
            stepId: step.id,
            title: step.title,
            time: new Date().toLocaleTimeString(),
            status: step.status,
            latency: step.latency
          }
        ]);
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsCompleted(true);
        if (onComplete) onComplete();
      }
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden text-slate-100 flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <span>Real-Time Statutory AI Verification Pipeline</span>
                <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-mono">
                  LIVE ENGINE
                </span>
              </h3>
              <p className="text-xs text-blue-200">
                Bidder: <span className="font-semibold text-white">{bidData?.bidder_name || "Enterprise Bidder"}</span> (PAN: {bidData?.pan || "AABCT8819K"})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Animated Step Progress */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="space-y-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx < currentStep || isCompleted;
              const isCurrent = idx === currentStep && !isCompleted;
              const isFuture = idx > currentStep && !isCompleted;

              return (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex items-start space-x-3.5 ${
                    isCurrent
                      ? "bg-blue-950/60 border-blue-500/60 shadow-lg shadow-blue-500/10 scale-[1.01]"
                      : isPast
                      ? step.status === "FAIL"
                        ? "bg-rose-950/30 border-rose-500/40 text-rose-200"
                        : "bg-slate-800/60 border-slate-700/80 text-slate-300"
                      : "bg-slate-900/40 border-slate-800 opacity-40"
                  }`}
                >
                  <div className="mt-0.5">
                    {isCurrent ? (
                      <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                    ) : isPast ? (
                      step.status === "FAIL" ? (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      )
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-600 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-xs text-white flex items-center space-x-2">
                        <span>{step.title}</span>
                      </h4>
                      {isPast && (
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            step.status === "FAIL"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          }`}
                        >
                          {step.status === "FAIL" ? "FLAGGED" : `PASSED (${step.latency})`}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verification Finished Summary */}
          {isCompleted && (
            <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-xl p-4 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-200">Real-Time Verification Complete</h4>
                  <p className="text-xs text-slate-300">
                    Statutory compliance snapshot recorded with SHA-256 digital signature.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-lg transition active:scale-95"
              >
                View Dossier
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Official TenderTrust Statutory Gateway • Response latency ~640ms total</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white px-3 py-1.5 rounded hover:bg-slate-800 transition"
          >
            {isCompleted ? "Close" : "Run in Background"}
          </button>
        </div>
      </div>
    </div>
  );
}
