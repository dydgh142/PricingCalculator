import React, { useState, useEffect } from 'react';

import { Card, CardContent } from './components/ui/card';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

export default function PricingCalculator() {
  const [price1, setPrice1] = useState('');
  const [price2, setPrice2] = useState('');
  const [profitRate, setProfitRate] = useState(5);
  const [finalPrice, setFinalPrice] = useState(null);
  const [bothPrices, setBothPrices] = useState({ price1: null, price2: null });
  const [recordText, setRecordText] = useState(''); // 기록할 텍스트 상태
  const [records, setRecords] = useState([]); // 기록 리스트 상태

  const calculatePrice = (newProfitRate) => {
    const basePrice1 = parseFloat(price1);
    const basePrice2 = price2 ? parseFloat(price2) : null;

    if (isNaN(basePrice1)) {
      setFinalPrice(null);
      return;
    }

    // 새로운 이익률을 반영한 계산
    const calculatedPrice1 = Math.round(basePrice1 * (1 + newProfitRate / 100));
    const calculatedPrice2 = basePrice2 ? Math.round(basePrice2 * (1 + newProfitRate / 100)) : null;

    setBothPrices({ price1: calculatedPrice1, price2: calculatedPrice2 });

    const basePrice = Math.min(basePrice1, basePrice2 || basePrice1);
    const calculatedFinalPrice = Math.round(basePrice * (1 + newProfitRate / 100));
    setFinalPrice(calculatedFinalPrice);
  };

  useEffect(() => {
    // 이익률이 바뀔 때마다 계산을 다시 수행
    calculatePrice(profitRate);
  }, [profitRate, calculatePrice]); // calculatePrice를 의존성 배열에 추가

  const formatPrice = (price) => {
    return price ? price.toLocaleString() : '-';
  };

  const handleRecord = () => {
    if (recordText && finalPrice !== null) {
      const record = {
        text: recordText,
        price1: parseFloat(price1),
        price2: price2 ? parseFloat(price2) : '-',
        profitRate: profitRate,
        price1WithProfit: Math.round(price1 * (1 + profitRate / 100)),
        price2WithProfit: price2 ? Math.round(price2 * (1 + profitRate / 100)) : '-',
      };

      setRecords([...records, record]);
      setRecordText(''); // 기록 후 텍스트 입력칸 비우기
    }
  };

  return (
    <div className='flex justify-center items-start min-h-screen bg-gray-100'>
      <div className='flex w-full max-w-5xl justify-between'>
        {/* 왼쪽: 가격 계산기 */}
        <div className='flex-1 max-w-lg p-4'>
          <Card className='w-full shadow-lg rounded-lg'>
            <CardContent>
              <h1 className='text-2xl font-bold mb-4'>판매 가격 계산기</h1>
              <Input
                type='number'
                placeholder='일반출하가'
                value={price1}
                onChange={(e) => { setPrice1(e.target.value); }}
                onBlur={() => calculatePrice(profitRate)} // 입력 후 블러 시 계산
                className='mb-4'
              />
              <Input
                type='number'
                placeholder='예외가 (선택)'
                value={price2}
                onChange={(e) => { setPrice2(e.target.value); }}
                onBlur={() => calculatePrice(profitRate)} // 입력 후 블러 시 계산
                className='mb-4'
              />
              <div className='mb-4'>
                <span className='block mb-2 font-semibold'>이익률 선택:</span>
                {[5, 7, 10, 12, 15, 20].map((rate) => (
                  <label key={rate} className='inline-flex items-center mr-4'>
                    <input
                      type='radio'
                      name='profitRate'
                      value={rate}
                      checked={profitRate === rate}
                      onChange={() => { setProfitRate(rate); }} // profitRate 변경 시 자동으로 계산
                      className='form-radio text-blue-600'
                    />
                    <span className='ml-1'>{rate}%</span>
                  </label>
                ))}
              </div>
              
              {finalPrice !== null && (
                <div className='mt-4 text-xl'>
                  <div>일반 출하가 기준: <span className='font-bold'>{formatPrice(bothPrices.price1)} 원</span></div>
                  <div>예외 가격 기준: <span className='font-bold'>{formatPrice(bothPrices.price2)} 원</span></div>
                </div>
              )}

              {/* 텍스트 입력과 기록 버튼 추가 */}
              <div className='mt-4'>
                <Input
                  type='text'
                  placeholder='제품명 (ex. EE-1010)'
                  value={recordText}
                  onChange={(e) => setRecordText(e.target.value)}
                  className='mb-2'
                />
                <Button onClick={handleRecord} className='w-full'>기록하기</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 기록된 가격 리스트 */}
        <div className='w-1/3 p-4'>
          {records.length > 0 && (
            <Card className='shadow-lg rounded-lg p-4'>
              <h2 className='text-xl font-semibold mb-4'>기록된 가격들</h2>
              <div className='overflow-x-auto'>
                <table className='min-w-full table-auto'>
                  <thead>
                    <tr>
                      <th className='border-b p-2'>제품명</th>
                      <th className='border-b p-2'>일반 출하가</th>
                      <th className='border-b p-2'>예외 가격</th>
                      <th className='border-b p-2'>이익률</th>
                      <th className='border-b p-2'>일출가+</th>
                      <th className='border-b p-2'>예외가+</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, index) => (
                      <tr key={index}>
                        <td className='border-b p-2'>{record.text}</td>
                        <td className='border-b p-2'>{formatPrice(record.price1)} 원</td>
                        <td className='border-b p-2'>{record.price2 !== '-' ? formatPrice(record.price2) : '-'}</td>
                        <td className='border-b p-2'>{record.profitRate}%</td>
                        <td className='border-b p-2'>{formatPrice(record.price1WithProfit)} 원</td>
                        <td className='border-b p-2'>{record.price2WithProfit !== '-' ? formatPrice(record.price2WithProfit) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
