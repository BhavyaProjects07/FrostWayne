'use client'

import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Video, 
  Camera, 
  Clock, 
  Package, 
  XCircle, 
  Info, 
  FileText, 
  AlertTriangle,
  ArrowRight,
  RefreshCcw,
  Lock,
  Mail,
  UserCheck
} from 'lucide-react';

const PrivacyPolicy = () => {
  const [isVisible, setIsVisible] = useState(false);
  const currentDate = new Date().toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  }).toUpperCase();

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="bg-[#1A1614] text-[#F7F3F0] min-h-screen pt-48 pb-32 px-6 font-light overflow-hidden relative selection:bg-[#C5A059]/30">
      {/* Background Architectural Text */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.02] select-none">
        <h2 className="text-[25vw] font-serif leading-none absolute -left-20 top-40 rotate-90 tracking-tighter">ATELIER</h2>
        <h2 className="text-[25vw] font-serif leading-none absolute -right-20 bottom-40 -rotate-90 tracking-tighter">SYSTEMS</h2>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className={`mb-32 space-y-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center space-x-6">
            <RefreshCcw className="text-[#C5A059]" size={20} />
            <div className="h-[1px] w-12 bg-[#C5A059]/40"></div>
            <span className="text-[10px] tracking-[0.8em] text-[#C5A059] uppercase font-bold">Maison Protocol</span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-8xl tracking-tighter leading-[0.85]">
            Quality Assurance <br/>
            <span className="italic text-[#C5A059]">& Proof Directives.</span>
          </h1>
          
          <div className="flex flex-wrap gap-8 text-[9px] tracking-[0.5em] uppercase text-[#D4C4B5]/50 border-y border-[#C5A059]/10 py-8">
            <span className="flex items-center gap-2"><FileText size={12}/> REF: FW-QA-48H</span>
            <span className="flex items-center gap-2"><Clock size={12}/> LAST UPDATED: {currentDate}</span>
            <span className="flex items-center gap-2"><Lock size={12}/> ENCRYPTED PROTOCOL</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-32 max-w-4xl">
          <p className="text-[#D4C4B5] text-xl md:text-2xl leading-relaxed font-light border-l border-[#C5A059]/30 pl-10 italic">
            At FrostWayne, we value transparency, quality, and fairness. To ensure a smooth shopping experience and prevent misuse, we follow a strict order processing, cancellation, and return verification policy.
          </p>
        </div>

        {/* Order Status Section */}
        <div className="mb-40">
          <div className="flex items-center justify-between mb-16">
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.4em] text-[#C5A059] uppercase font-bold">Phase 01</span>
              <h2 className="font-serif text-4xl">Order Status Pipeline</h2>
            </div>
            <Package className="text-[#C5A059]/20" size={48} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { id: "01", status: "Order Placed", detail: "Customer successfully placed order. Details confirmed via email/SMS.", cancel: "Allowed", icon: <FileText size={18}/> },
              { id: "02", status: "Shipped", detail: "Dispatched from supplier. Logistics processing active.", cancel: "Locked", icon: <RefreshCcw size={18}/> },
              { id: "03", status: "Out for Delivery", detail: "Order with courier for final delivery phase.", cancel: "Locked", icon: <ArrowRight size={18}/> },
              { id: "04", status: "Delivered", detail: "Successfully received. 48-hour window initiated.", cancel: "Complete", icon: <ShieldCheck size={18}/> },
            ].map((stage, i) => (
              <div key={i} className="relative p-10 bg-[#2A2422]/30 border border-[#C5A059]/10 group hover:border-[#C5A059]/40 transition-all duration-700">
                <div className="flex justify-between items-start mb-8">
                  <span className="text-[10px] font-mono text-[#C5A059]/60">S_{stage.id}</span>
                  <div className="text-[#C5A059]/40 group-hover:text-[#C5A059] transition-colors">{stage.icon}</div>
                </div>
                <h3 className="font-serif text-2xl mb-6 text-[#E8DED1]">{stage.status}</h3>
                <p className="text-[11px] leading-loose text-[#D4C4B5]/60 tracking-widest uppercase mb-8">{stage.detail}</p>
                <div className={`text-[9px] tracking-[0.3em] uppercase font-bold p-2 border ${stage.cancel === 'Allowed' ? 'border-[#C5A059]/20 text-[#C5A059]' : 'border-red-900/30 text-red-500 bg-red-950/10'}`}>
                  Cancellation: {stage.cancel}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 border-l-2 border-red-500 bg-red-950/5">
            <p className="text-[11px] tracking-widest text-red-500 uppercase font-bold">
              Notice: Once an order is marked as "Shipped", it cannot be cancelled under any circumstances.
            </p>
          </div>
        </div>

        {/* Verification Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-40">
          <div className="p-16 bg-[#2A2422] border border-[#C5A059]/10 relative overflow-hidden">
             <Clock className="text-[#C5A059] absolute -right-8 -top-8 opacity-[0.03]" size={200} />
             <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-6">
                    <Clock className="text-[#C5A059]" size={32} />
                    <h3 className="font-serif text-4xl italic">The 48H Window</h3>
                </div>
                <ul className="space-y-6 text-[11px] tracking-[0.2em] uppercase text-[#D4C4B5] leading-loose">
                    <li className="flex gap-4 items-start"><Info size={14} className="mt-1 text-[#C5A059]"/> Inspect order within 48 hours of delivery.</li>
                    <li className="flex gap-4 items-start"><Info size={14} className="mt-1 text-[#C5A059]"/> Any issues must be reported within this time frame.</li>
                    <li className="flex gap-4 items-start text-red-500 font-bold"><AlertTriangle size={14} className="mt-1"/> Requests after 48 hours are automatically rejected.</li>
                </ul>
             </div>
          </div>

          <div className="p-16 bg-[#2A2422] border border-[#C5A059]/10 relative overflow-hidden">
             <Camera className="text-[#C5A059] absolute -right-8 -top-8 opacity-[0.03]" size={200} />
             <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-6">
                    <Camera className="text-[#C5A059]" size={32} />
                    <h3 className="font-serif text-4xl italic">Mandatory Proof</h3>
                </div>
                <ul className="space-y-6 text-[11px] tracking-[0.2em] uppercase text-[#D4C4B5] leading-loose">
                    <li className="flex gap-4 items-start font-bold text-[#E8DED1]"><Video size={14} className="mt-1 text-[#C5A059]"/> Continuous & uncut unboxing video.</li>
                    <li className="flex gap-4 items-start font-bold text-[#E8DED1]"><Camera size={14} className="mt-1 text-[#C5A059]"/> Clear photography of product, packaging, and defect.</li>
                    <li className="flex gap-4 items-start text-red-500 font-bold"><AlertTriangle size={14} className="mt-1"/> Requests without BOTH will be rejected.</li>
                </ul>
             </div>
          </div>
        </div>

        {/* Eligibility Matrix */}
        <div className="mb-40 border-t border-[#C5A059]/10 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <div className="space-y-12">
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.4em] text-[#C5A059] uppercase font-bold">Matrix 01</span>
                <h3 className="font-serif text-4xl">Eligible Claims</h3>
              </div>
              <ul className="space-y-8">
                {['Product received is damaged', 'Product is defective', 'Wrong item delivered'].map((item, i) => (
                  <li key={i} className="flex items-center space-x-6 text-[12px] tracking-[0.2em] uppercase text-[#D4C4B5]">
                    <ShieldCheck className="text-green-600/60" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-12">
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.4em] text-red-500/60 uppercase font-bold">Matrix 02</span>
                <h3 className="font-serif text-4xl text-red-500/80">Restricted Claims</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Change of mind',
                  'Size, color, or style preference',
                  'Minor variations (lighting/display)',
                  'Used, washed, or altered products',
                  'Missing original tags or packaging',
                  'Claims raised after 48 hours'
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-6 text-[10px] tracking-[0.15em] uppercase text-[#D4C4B5]/40 italic">
                    <XCircle className="text-red-950" size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Video Directives */}
        <div className="bg-[#2A2422] p-16 border border-[#C5A059]/10 mb-40 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-[#C5A059]/20 transition-all duration-700 group-hover:w-40 group-hover:h-40"></div>
          <div className="max-w-3xl mx-auto space-y-16 relative z-10">
            <div className="text-center space-y-4">
               <Video size={40} className="text-[#C5A059] mx-auto mb-6" />
               <h3 className="font-serif text-5xl">Unboxing Video Directives</h3>
               <p className="text-[10px] tracking-[0.6em] uppercase text-[#C5A059]">Strict Compliance Required</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
               <ul className="space-y-6 text-[11px] tracking-widest text-[#D4C4B5] uppercase leading-relaxed">
                  <li className="flex items-start gap-4">• Start recording BEFORE seal is broken.</li>
                  <li className="flex items-start gap-4">• Clearly display the shipping label.</li>
                  <li className="flex items-start gap-4">• Continuous footage (No cuts or edits).</li>
                  <li className="flex items-start gap-4">• Explicitly display the claimed issue.</li>
               </ul>
               <div className="p-8 border border-red-500/20 bg-[#1A1614] flex flex-col items-center justify-center text-center">
                  <AlertTriangle className="text-red-500 mb-6" size={32} />
                  <p className="text-[10px] tracking-widest uppercase text-red-500/80 font-bold leading-loose">
                    EDITED, UNCLEAR, CROPPED, OR INCOMPLETE MEDIA FILES WILL BE AUTOMATICALLY REJECTED BY SYSTEM ADMINISTRATION.
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Administrative Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
           {[
             { title: "Review Process", detail: "All requests are reviewed within 24–48 hours. Approval depends entirely on proof verification. Decisions are final and binding.", icon: <Info size={18}/> },
             { title: "Abuse Prevention", detail: "Accounts with repeated or suspicious requests may be restricted. Fraudulent claims result in permanent account suspension.", icon: <AlertTriangle size={18}/> },
             { title: "Financials", detail: "Refunds processed only after verification to original payment method. Replacements subject to stock availability.", icon: <Lock size={18}/> },
           ].map((item, i) => (
             <div key={i} className="p-10 border border-[#C5A059]/10 space-y-8">
                <div className="text-[#C5A059]/60">{item.icon}</div>
                <h4 className="font-serif text-2xl italic">{item.title}</h4>
                <p className="text-[10px] tracking-widest uppercase text-[#D4C4B5]/60 leading-relaxed">{item.detail}</p>
             </div>
           ))}
        </div>

        {/* Contact & Acknowledgement */}
        <div className="text-center space-y-20 border-t border-[#C5A059]/10 pt-32">
          <div className="space-y-8">
            <Mail className="text-[#C5A059] mx-auto" size={32} />
            <div className="space-y-2">
              <p className="text-[11px] tracking-[0.5em] uppercase text-[#C5A059] font-bold">Contact Support Protocol</p>
              <p className="text-[10px] tracking-widest uppercase text-[#D4C4B5]/40">Ensure all unboxing media and Order ID are attached.</p>
            </div>
            <a href="mailto:support@frostwayne.shop" className="block font-serif text-4xl md:text-6xl text-[#E8DED1] hover:text-[#C5A059] transition-all duration-700 underline underline-offset-[16px] decoration-[1px] decoration-[#C5A059]/30">
              support@frostwayne.shop
            </a>
          </div>

          <div className="max-w-2xl mx-auto space-y-12">
             <div className="flex items-center justify-center space-x-6">
                <UserCheck size={16} className="text-[#C5A059]" />
                <span className="text-[11px] tracking-[0.8em] uppercase text-[#D4C4B5]/60">Customer Acknowledgement</span>
             </div>
             <p className="text-[9px] tracking-[0.6em] uppercase text-[#D4C4B5]/30 leading-loose">
                BY PLACING AN ORDER ON FROSTWAYNE, YOU CONFIRM FULL COMPLIANCE WITH THIS QUALITY ASSURANCE SYSTEM AND ACCEPT THE PROOF-BASED RETURN PROTOCOL.
             </p>
             <div className="w-12 h-[1px] bg-[#C5A059]/20 mx-auto"></div>
             <p className="font-serif text-xl italic text-[#C5A059]/40 tracking-widest">
                Excellence is an architectural standard.
             </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;