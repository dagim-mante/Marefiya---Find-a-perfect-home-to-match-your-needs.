import { AssetWithImagesAndTags } from '@/lib/infer-type'
import {create} from 'zustand'


type AssetsType = {
    assets: AssetWithImagesAndTags[],
    toFilterAssetsIds: number[],
    setAssets: (passedAssets: AssetWithImagesAndTags[]) => void,
    addToFilterAssetsIds: (id: number) => void,
}

export const useAssetsStore = create<AssetsType>((set) => ({
    assets: [],
    toFilterAssetsIds: [],
    setAssets: (passedAssets) => set({ assets: passedAssets}),
    addToFilterAssetsIds: (id) => set(state => {
        const exists = state.toFilterAssetsIds.find(i => i === id)
        if(exists){
            return {
                ...state,
                toFilterAssetsIds: state.toFilterAssetsIds
            }
        }
        return {
            ...state,
            toFilterAssetsIds: [...state.toFilterAssetsIds, id]
        }
    })
}))