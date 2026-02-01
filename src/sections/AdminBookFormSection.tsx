import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, X, Image as ImageIcon, FileText, Save, Loader2 } from 'lucide-react';
import { useAdminBooks, categories } from '@/hooks/useBooks';
import type { AgeCategory } from '@/types';
import { FloatingCircle } from '@/components/MemphisPatterns';
import { toast } from 'sonner';

interface AdminBookFormSectionProps {
    onBack: () => void;
    editBookId?: string;
}

const AdminBookFormSection: React.FC<AdminBookFormSectionProps> = ({ onBack, editBookId }) => {
    const { addBook, updateBook, uploadCoverImage, uploadPdfFile, books } = useAdminBooks();
    const isEditing = !!editBookId;
    const existingBook = isEditing ? books.find(b => b.id === editBookId) : null;

    const [formData, setFormData] = useState({
        title: existingBook?.title || '',
        subtitle: existingBook?.subtitle || '',
        description: existingBook?.description || '',
        price: existingBook?.price || 299,
        originalPrice: existingBook?.originalPrice || 0,
        category: (existingBook?.category || 'baby') as AgeCategory,
        ageRange: existingBook?.ageRange || '0-2 ปี',
        pages: existingBook?.pages || 100,
        features: existingBook?.features?.join('\n') || '',
        isNew: existingBook?.isNew || false,
        isBestseller: existingBook?.isBestseller || false,
    });

    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>(existingBook?.image || '');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const coverInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                toast.error('กรุณาเลือกไฟล์ PDF เท่านั้น');
                return;
            }
            setPdfFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validation
            if (!formData.title.trim()) {
                toast.error('กรุณากรอกชื่อหนังสือ');
                return;
            }

            if (!isEditing && !coverFile) {
                toast.error('กรุณาอัปโหลดรูปปก');
                return;
            }

            if (!isEditing && !pdfFile) {
                toast.error('กรุณาอัปโหลดไฟล์ PDF');
                return;
            }

            // Create book first to get ID
            const bookId = isEditing ? editBookId : `book-${Date.now()}`;

            let coverUrl = existingBook?.image || '';
            let pdfUrl = existingBook?.pdfUrl || '';

            // Upload cover image
            if (coverFile) {
                const uploadedCoverUrl = await uploadCoverImage(coverFile, bookId);
                if (uploadedCoverUrl) {
                    coverUrl = uploadedCoverUrl;
                }
            }

            // Upload PDF file
            if (pdfFile) {
                const uploadedPdfUrl = await uploadPdfFile(pdfFile, bookId);
                if (uploadedPdfUrl) {
                    pdfUrl = uploadedPdfUrl;
                }
            }

            const bookData = {
                title: formData.title,
                subtitle: formData.subtitle || null,
                description: formData.description || null,
                price: formData.price,
                original_price: formData.originalPrice > 0 ? formData.originalPrice : null,
                cover_image_url: coverUrl || null,
                pdf_url: pdfUrl || null,
                category: formData.category,
                age_range: formData.ageRange,
                pages: formData.pages,
                features: formData.features.split('\n').filter(f => f.trim()),
                is_new: formData.isNew,
                is_bestseller: formData.isBestseller,
                is_active: true,
            };

            if (isEditing) {
                const success = await updateBook(editBookId, bookData);
                if (success) {
                    toast.success('แก้ไขหนังสือสำเร็จ!');
                    onBack();
                }
            } else {
                const newBook = await addBook(bookData);
                if (newBook) {
                    toast.success('เพิ่มหนังสือใหม่สำเร็จ!');
                    onBack();
                }
            }
        } catch (error) {
            console.error('Error saving book:', error);
            toast.error('เกิดข้อผิดพลาดในการบันทึก');
        } finally {
            setLoading(false);
        }
    };

    // Get age range options based on category
    const getAgeRangeOptions = (category: AgeCategory) => {
        const ageRanges: Record<AgeCategory, string> = {
            baby: '0-2 ปี',
            preschool: '3-5 ปี',
            elementary: '6-9 ปี',
            preteen: '10-12 ปี',
        };
        return ageRanges[category];
    };

    return (
        <section className="relative min-h-screen bg-gray-50 py-8 overflow-hidden">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)',
                    backgroundSize: '30px 30px'
                }}
            />

            <FloatingCircle color="#FF006E" size={40} className="top-20 right-[5%] opacity-30" />
            <FloatingCircle color="#FFBE0B" size={30} className="bottom-20 left-[3%] opacity-30" />

            <div className="relative z-10 max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-black/70 hover:text-black font-semibold mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        กลับไปรายการหนังสือ
                    </button>

                    <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000]">
                        <h1 className="font-fredoka font-bold text-2xl text-black">
                            {isEditing ? 'แก้ไขหนังสือ' : 'เพิ่มหนังสือใหม่'}
                        </h1>
                        <p className="text-black/60 text-sm">
                            {isEditing ? 'แก้ไขข้อมูลหนังสือที่เลือก' : 'กรอกข้อมูลและอัปโหลดไฟล์เพื่อเพิ่มหนังสือใหม่'}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Cover Image & PDF Upload */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Cover Image */}
                        <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000]">
                            <h3 className="font-fredoka font-bold text-lg mb-4 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-memphis-pink" />
                                รูปปกหนังสือ
                            </h3>

                            <input
                                type="file"
                                ref={coverInputRef}
                                onChange={handleCoverChange}
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                            />

                            {coverPreview ? (
                                <div className="relative">
                                    <img
                                        src={coverPreview}
                                        alt="Cover preview"
                                        className="w-full aspect-[2/3] object-cover border-3 border-black rounded-xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCoverFile(null);
                                            setCoverPreview('');
                                        }}
                                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => coverInputRef.current?.click()}
                                    className="w-full aspect-[2/3] border-3 border-dashed border-black/30 rounded-xl flex flex-col items-center justify-center hover:border-memphis-pink hover:bg-memphis-pink/5 transition-colors"
                                >
                                    <Upload className="w-10 h-10 text-black/40 mb-2" />
                                    <span className="text-black/60 font-semibold">คลิกเพื่ออัปโหลด</span>
                                    <span className="text-black/40 text-sm">JPG, PNG, WebP</span>
                                </button>
                            )}
                        </div>

                        {/* PDF File */}
                        <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000]">
                            <h3 className="font-fredoka font-bold text-lg mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-memphis-purple" />
                                ไฟล์ PDF
                            </h3>

                            <input
                                type="file"
                                ref={pdfInputRef}
                                onChange={handlePdfChange}
                                accept="application/pdf"
                                className="hidden"
                            />

                            {pdfFile ? (
                                <div className="border-3 border-black rounded-xl p-4 bg-memphis-green/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-memphis-green border-2 border-black rounded-lg flex items-center justify-center">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">{pdfFile.name}</p>
                                            <p className="text-sm text-black/60">
                                                {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setPdfFile(null)}
                                            className="w-8 h-8 bg-red-500 text-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => pdfInputRef.current?.click()}
                                    className="w-full h-32 border-3 border-dashed border-black/30 rounded-xl flex flex-col items-center justify-center hover:border-memphis-purple hover:bg-memphis-purple/5 transition-colors"
                                >
                                    <Upload className="w-10 h-10 text-black/40 mb-2" />
                                    <span className="text-black/60 font-semibold">คลิกเพื่ออัปโหลด PDF</span>
                                </button>
                            )}

                            {existingBook?.pdfUrl && !pdfFile && (
                                <p className="mt-2 text-sm text-black/60">
                                    มี PDF อยู่แล้ว อัปโหลดใหม่เพื่อแทนที่
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Book Details */}
                    <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000]">
                        <h3 className="font-fredoka font-bold text-lg mb-4">ข้อมูลหนังสือ</h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Title */}
                            <div className="md:col-span-2">
                                <label className="block font-semibold text-sm mb-2">
                                    ชื่อหนังสือ (ภาษาไทย) <span className="text-memphis-pink">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="เช่น จิตวิทยาลึกลับของทารก"
                                    className="w-full px-4 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all"
                                    required
                                />
                            </div>

                            {/* Subtitle */}
                            <div className="md:col-span-2">
                                <label className="block font-semibold text-sm mb-2">
                                    ชื่อหนังสือ (ภาษาอังกฤษ)
                                </label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    placeholder="เช่น Psychology of Babies"
                                    className="w-full px-4 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block font-semibold text-sm mb-2">
                                    หมวดหมู่ <span className="text-memphis-pink">*</span>
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => {
                                        const newCategory = e.target.value as AgeCategory;
                                        setFormData({
                                            ...formData,
                                            category: newCategory,
                                            ageRange: getAgeRangeOptions(newCategory)
                                        });
                                    }}
                                    className="w-full px-4 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all appearance-none cursor-pointer"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nameTh} ({cat.ageRange})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Pages */}
                            <div>
                                <label className="block font-semibold text-sm mb-2">
                                    จำนวนหน้า
                                </label>
                                <input
                                    type="number"
                                    value={formData.pages}
                                    onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
                                    min={1}
                                    className="w-full px-4 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block font-semibold text-sm mb-2">
                                    ราคา (บาท) <span className="text-memphis-pink">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    className="w-full px-4 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all"
                                    required
                                />
                            </div>

                            {/* Original Price */}
                            <div>
                                <label className="block font-semibold text-sm mb-2">
                                    ราคาเดิม (ถ้ามีส่วนลด)
                                </label>
                                <input
                                    type="number"
                                    value={formData.originalPrice}
                                    onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    placeholder="0 = ไม่มีส่วนลด"
                                    className="w-full px-4 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block font-semibold text-sm mb-2">
                                    คำอธิบาย
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    placeholder="อธิบายเกี่ยวกับหนังสือ..."
                                    className="w-full px-4 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all resize-none"
                                />
                            </div>

                            {/* Features */}
                            <div className="md:col-span-2">
                                <label className="block font-semibold text-sm mb-2">
                                    จุดเด่น (1 บรรทัด = 1 จุดเด่น)
                                </label>
                                <textarea
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    rows={4}
                                    placeholder="เข้าใจพัฒนาการสมองทารก&#10;เทคนิคการสื่อสารกับลูกน้อย&#10;วิธีสร้างความผูกพันที่ดี"
                                    className="w-full px-4 py-3 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all resize-none"
                                />
                            </div>

                            {/* Badges */}
                            <div className="md:col-span-2 flex flex-wrap gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isNew}
                                        onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                                        className="w-5 h-5 accent-memphis-green"
                                    />
                                    <span className="font-semibold">หนังสือใหม่ (NEW)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isBestseller}
                                        onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                                        className="w-5 h-5 accent-memphis-pink"
                                    />
                                    <span className="font-semibold">ขายดี (HOT)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onBack}
                            className="flex-1 btn-memphis bg-white text-black"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-memphis bg-memphis-pink flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    กำลังบันทึก...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มหนังสือ'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default AdminBookFormSection;
