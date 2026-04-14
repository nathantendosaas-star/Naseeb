import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useRef } from 'react';
import SEO from '../../components/SEO';

export default function ImportPage() {
  const [cifValue, setCifValue] = useState<number>(50000);
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end start"]
  });

  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 150]);

  // Simplified URA Tax Calculation (Mock values for demonstration)
  const importDuty = cifValue * 0.25;
  const vat = (cifValue + importDuty) * 0.18;
  const withholdingTax = cifValue * 0.06;
  const infrastructureLevy = cifValue * 0.015;
  const totalTax = importDuty + vat + withholdingTax + infrastructureLevy;

  const timeline = [
    { step: '1', title: 'Vehicle Sourcing', desc: 'We locate your desired vehicle globally.' },
    { step: '2', title: 'Purchase & Inspection', desc: 'Secure transaction and rigorous quality check.' },
    { step: '3', title: 'Shipping', desc: 'Ocean freight to Mombasa or Dar es Salaam.' },
    { step: '4', title: 'Customs Clearance', desc: 'Handling all URA paperwork and taxes.' },
    { step: '5', title: 'Delivery', desc: 'Final detailing and handover in Kampala.' },
  ];

  return (
    <div ref={pageRef} className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 bg-auto-bg text-auto-text">
      <SEO 
        title="Import & Logistics | Grid Motors"
        description="Professional vehicle importation services to Uganda. We handle sourcing, shipping, and URA customs clearance for your dream car."
        canonical="/cars/import"
      />
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ y: yTitle }}
          className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4"
        >
          Import & Logistics
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-500 mb-16"
        >
          Seamless vehicle importation to Uganda.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Tax Calculator */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 p-8 rounded-2xl border border-gray-200"
          >
            <h2 className="text-2xl font-bold uppercase tracking-widest mb-8">URA Tax Estimator</h2>
            
            <div className="mb-8">
              <label className="block text-sm font-bold tracking-widest text-gray-500 uppercase mb-2">
                CIF Value (USD)
              </label>
              <input 
                type="range" 
                min="10000" 
                max="200000" 
                step="1000"
                value={cifValue}
                onChange={(e) => setCifValue(Number(e.target.value))}
                className="w-full accent-auto-accent"
              />
              <div className="text-3xl font-mono font-bold mt-4">${cifValue.toLocaleString()}</div>
            </div>

            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Import Duty (25%)</span>
                <span className="font-mono font-bold">${importDuty.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">VAT (18%)</span>
                <span className="font-mono font-bold">${vat.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Withholding Tax (6%)</span>
                <span className="font-mono font-bold">${withholdingTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Infrastructure Levy (1.5%)</span>
                <span className="font-mono font-bold">${infrastructureLevy.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4 mt-4">
                <span className="font-bold uppercase tracking-widest">Estimated Total Tax</span>
                <span className="font-mono font-bold text-2xl text-auto-accent">${totalTax.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-6">*Estimates only. Actual taxes may vary based on URA valuation.</p>
          </motion.div>

          {/* Shipping Timeline */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold uppercase tracking-widest mb-8">Shipping Timeline</h2>
            <div className="relative border-l-2 border-gray-200 ml-4 space-y-12">
              {timeline.map((item) => (
                <div key={item.step} className="relative pl-8">
                  <div className="absolute -left-[17px] top-0 w-8 h-8 bg-white border-4 border-auto-accent rounded-full flex items-center justify-center text-xs font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold uppercase mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
