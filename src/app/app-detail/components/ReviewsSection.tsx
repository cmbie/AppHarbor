'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star, Trash2, ThumbsUp, Pencil, MessageSquare, Info } from 'lucide-react';
import { storage, type LocalReview } from '@/lib/storage';
import { formatDate } from '@/lib/validation';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';

interface ReviewForm {
    rating: number;
    text: string;
}

function Stars({ value, size = 16 }: { value: number; size?: number }) {
    return (
        <span className="inline-flex" aria-label={`${value} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((n) => (
                <Star key={`star-${n}`} size={size} className={n <= value ? 'fill-primary text-primary' : 'text-input'} />
            ))}
        </span>
    );
}

export default function ReviewsSection({ appId, appName }: { appId: string; appName: string }) {
    const { push } = useToast();
    const [all, setAll] = useState<LocalReview[]>([]);
    const [sort, setSort] = useState<'newest' | 'highest'>('newest');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [hoverStar, setHoverStar] = useState(0);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ReviewForm>({ defaultValues: { rating: 0, text: '' } });

    const rating = watch('rating');

    useEffect(() => {
        setAll(storage.getReviews());
    }, []);

    useEffect(() => {
        register('rating', { validate: (v) => (v >= 1 && v <= 5) || 'Choose a rating from 1 to 5 stars' });
    }, [register]);

    const mine = useMemo(() => {
        const list = all.filter((r) => r.appId === appId);
        return [...list].sort((a, b) =>
            sort === 'newest' ? b.createdAt.localeCompare(a.createdAt) : b.rating - a.rating
        );
    }, [all, appId, sort]);

    const average = mine.length ? mine.reduce((s, r) => s + r.rating, 0) / mine.length : 0;

    const persist = (next: LocalReview[]) => {
        setAll(next);
        const res = storage.setReviews(next);
        if (!res.ok) push('warning', 'Review could not be saved (browser storage is full).');
    };

    const onSubmit = handleSubmit((data) => {
        const text = data.text.trim();
        if (editingId) {
            persist(all.map((r) => (r.id === editingId ? { ...r, rating: data.rating, text } : r)));
            push('success', 'Review updated');
        } else {
            const review: LocalReview = {
                id: `review-${Date.now()}-${all.length + 1}`,
                appId,
                rating: data.rating,
                text,
                createdAt: new Date().toISOString(),
                helpful: 0,
            };
            persist([review, ...all]);
            push('success', 'Review saved locally in this browser');
        }
        setEditingId(null);
        reset({ rating: 0, text: '' });
    });

    const startEdit = (r: LocalReview) => {
        setEditingId(r.id);
        setValue('rating', r.rating);
        setValue('text', r.text);
    };

    const remove = (id: string) => {
        persist(all.filter((r) => r.id !== id));
        push('info', 'Review deleted');
    };

    const helpful = (id: string) => persist(all.map((r) => (r.id === id ? { ...r, helpful: r.helpful + 1 } : r)));

    return (
        <section aria-labelledby="reviews-title">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
                <div>
                    <h2 id="reviews-title" className="text-xl font-bold">Ratings and Reviews</h2>
                    {mine.length > 0 ? (
                        <p className="text-sm text-muted-foreground tabular mt-1">
                            {average.toFixed(1)} average from {mine.length} local {mine.length === 1 ? 'review' : 'reviews'}
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground mt-1">No ratings yet — none are invented.</p>
                    )}
                </div>
                {mine.length > 1 ? (
                    <div>
                        <label htmlFor="review-sort" className="sr-only">Sort reviews</label>
                        <select
                            id="review-sort"
                            value={sort}
                            onChange={(e) => setSort(e.target.value as 'newest' | 'highest')}
                            className="field !w-auto"
                        >
                            <option value="newest">Newest</option>
                            <option value="highest">Highest rating</option>
                        </select>
                    </div>
                ) : null}
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-accent text-accent-foreground px-4 py-3 text-sm mb-4">
                <Info size={18} className="mt-0.5 shrink-0" />
                <p>
                    Reviews are stored only in this browser. Other visitors cannot see them, and they are not verified purchases or
                    global customer feedback.
                </p>
            </div>

            <form onSubmit={onSubmit} noValidate className="rounded-lg border border-border bg-card p-4 mb-5">
                <p className="label">{editingId ? 'Edit your review' : `Review ${appName}`}</p>
                <div className="flex items-center gap-1" role="radiogroup" aria-label="Star rating">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button
                            key={`rate-${n}`}
                            type="button"
                            role="radio"
                            aria-checked={rating === n}
                            aria-label={`${n} star${n > 1 ? 's' : ''}`}
                            onMouseEnter={() => setHoverStar(n)}
                            onMouseLeave={() => setHoverStar(0)}
                            onClick={() => setValue('rating', n, { shouldValidate: true })}
                            className="inline-flex h-11 w-11 items-center justify-center transition-transform duration-150 active:scale-95"
                        >
                            <Star size={26} className={n <= (hoverStar || rating) ? 'fill-primary text-primary' : 'text-input'} />
                        </button>
                    ))}
                </div>
                {errors.rating ? <p className="error-text">{errors.rating.message}</p> : null}

                <label htmlFor="review-text" className="label mt-3">Your review</label>
                <textarea
                    id="review-text"
                    rows={3}
                    className="field !py-2"
                    placeholder="What worked, what didn’t?"
                    {...register('text', {
                        required: 'Write at least a short review',
                        minLength: { value: 10, message: 'Please write at least 10 characters' },
                        maxLength: { value: 600, message: 'Keep reviews under 600 characters' },
                    })}
                />
                {errors.text ? <p className="error-text">{errors.text.message}</p> : <p className="helper">10–600 characters.</p>}

                <div className="mt-3 flex gap-2">
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                        {editingId ? 'Update review' : 'Submit review'}
                    </button>
                    {editingId ? (
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => {
                                setEditingId(null);
                                reset({ rating: 0, text: '' });
                            }}
                        >
                            Cancel
                        </button>
                    ) : null}
                </div>
            </form>

            {mine.length === 0 ? (
                <EmptyState
                    icon={<MessageSquare size={28} />}
                    title="No reviews yet"
                    body="Be the first to write one. It will be saved on this device only."
                />
            ) : (
                <ul className="flex flex-col gap-3">
                    {mine.map((r) => (
                        <li key={`rev-${r.id}`} className="rounded-lg border border-border bg-card p-4">
                            <div className="flex items-center justify-between gap-3">
                                <Stars value={r.rating} />
                                <span className="text-xs text-muted-foreground tabular">{formatDate(r.createdAt)}</span>
                            </div>
                            <p className="text-sm mt-2 break-words">{r.text}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <button type="button" onClick={() => helpful(r.id)} className="btn btn-ghost !min-h-[40px] border border-border">
                                    <ThumbsUp size={14} /> Helpful · {r.helpful}
                                </button>
                                <button type="button" onClick={() => startEdit(r)} className="btn btn-ghost !min-h-[40px]">
                                    <Pencil size={14} /> Edit
                                </button>
                                <button type="button" onClick={() => remove(r.id)} className="btn btn-ghost !min-h-[40px] text-destructive">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}