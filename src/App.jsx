import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingDown, ArrowRight, Award } from 'lucide-react';

export default function App() {
  const [exchangeRate, setExchangeRate] = useState('');
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateBestRates = () => {
    if (!exchangeRate || isNaN(exchangeRate) || Number(exchangeRate) <= 0) {
      alert("請輸入有效的匯率數值！");
      return;
    }

    setIsCalculating(true);
    const rate = Number(exchangeRate);
    const allCalculations = [];

    for (let usdCents = 100; usdCents <= 10000; usdCents++) {
      const usd = usdCents / 100;
      const twdRaw = usd * rate;
      const twdRounded = Math.round(twdRaw);
      const effectiveRate = twdRounded / usd;

      allCalculations.push({
        usd: usd,
        twd: twdRounded,
        effectiveRate: effectiveRate
      });
    }

    const range1 = allCalculations.filter(item => item.twd >= 250 && item.twd < 500);
    const range2 = allCalculations.filter(item => item.twd >= 500 && item.twd < 1000);
    const range3 = allCalculations.filter(item => item.twd >= 1000 && item.twd < 1500);

    const sortByEffectiveRate = (a, b) => {
      if (a.effectiveRate === b.effectiveRate) {
        return a.usd - b.usd;
      }
      return a.effectiveRate - b.effectiveRate;
    };

    setResults({
      range1: range1.sort(sortByEffectiveRate).slice(0, 3),
      range2: range2.sort(sortByEffectiveRate).slice(0, 3),
      range3: range3.sort(sortByEffectiveRate).slice(0, 3),
    });

    setIsCalculating(false);
  };

  const ResultCard = ({ title, data, range }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-4"> {/* 增加左右 px-5 */}
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Award size={18} className="text-yellow-300 sm:w-5 sm:h-5" />
          {title}
        </h3>
        <p className="text-emerald-100 text-xs sm:text-sm mt-1">{range}</p>
      </div>
      <div className="p-0 flex-grow">
        {/* 調整表格寬度，移除 w-full 改為 w-auto，並置中 */}
        <div className="flex justify-center w-full bg-white">
          <table className="w-auto text-xs sm:text-sm text-left table-auto mx-auto min-w-[280px]"> {/* 設定 min-w 確保不會過度縮小 */}
            <thead className="text-[10px] sm:text-xs text-gray-500 uppercase bg-gray-50/50">
              <tr>
                {/* 調整各欄位的寬度與對齊，增加左右 px-3 */}
                <th className="px-3 py-2 sm:py-3 text-center w-12">排名</th>
                <th className="px-3 py-2 sm:py-3 text-right w-16">USD</th>
                <th className="px-3 py-2 sm:py-3 text-right w-16">TWD</th>
                <th className="px-3 py-2 sm:py-3 text-right font-bold text-emerald-600 w-24">匯率*</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b last:border-b-0 hover:bg-emerald-50/50 transition-colors">
                  <td className="px-3 py-3 sm:py-4 text-center font-bold text-gray-400">
                    #{index + 1}
                  </td>
                  <td className="px-3 py-3 sm:py-4 text-right font-medium text-gray-900 tracking-tight">
                    ${item.usd.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 sm:py-4 text-right font-medium text-gray-900 tracking-tight">
                    {item.twd}
                  </td>
                  <td className="px-3 py-3 sm:py-4 text-right font-bold text-emerald-600 tracking-tight">
                    {item.effectiveRate.toFixed(4)}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-3 py-8 text-center text-gray-500">
                    此區間無符合結果
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        
        <div className="text-center space-y-2 sm:space-y-4">
          <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-emerald-100 rounded-full mb-1 sm:mb-2">
            <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            換匯利差最佳化試算
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            利用四捨五入機制，找出小額換匯時最優惠的實質匯率。
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 md:p-8 max-w-xl mx-auto">
          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-3">
            請輸入當前美元匯率 <span className="text-xs font-normal text-gray-500 block sm:inline sm:ml-1 mt-1 sm:mt-0">(支援至小數點後三位)</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.001"
                min="0"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && calculateBestRates()}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 text-base sm:text-lg transition-shadow"
                placeholder="例如: 31.255"
              />
            </div>
            <button
              onClick={calculateBestRates}
              disabled={isCalculating}
              className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors shadow-sm disabled:opacity-70 active:scale-95"
            >
              {isCalculating ? '計算中...' : '開始試算'}
              <ArrowRight className="ml-2 -mr-1 w-5 h-5 hidden sm:block" />
            </button>
          </div>
        </div>

        {results && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4 sm:mb-6">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">最佳換匯組合推薦</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <ResultCard title="永豐銀" range="新台幣 250 ~ 499 元" data={results.range1} />
              <ResultCard title="國泰銀" range="新台幣 500 ~ 999 元" data={results.range2} />
              <ResultCard title="玉山銀" range="新台幣 1000 ~ 1499 元" data={results.range3} />
            </div>
            
            <div className="mt-8 bg-blue-50 rounded-xl p-4 text-sm text-blue-800 flex gap-3 border border-blue-100 mx-1">
              <div className="mt-0.5">💡</div>
              <div>
                <p className="font-semibold mb-1">計算說明：</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>台幣 (TWD)</strong> = 四捨五入(美元 × 輸入匯率)</li>
                  <li><strong>實質匯率*</strong> = 四捨五入後的台幣 ÷ 美元 (越低越划算)</li>
                  <li>系統會自動遍歷 1.00 至 100.00 美元進行窮舉試算。</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
