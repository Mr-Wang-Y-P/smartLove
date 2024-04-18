<template>
    <div class="w-full p-2 my-2 flex  bg-white" @click="jumpPage(message.sessionNo,message.talkNo,message.userNo)">
        <div class="mr-2">
            <img class="w-12 h-12 rounded-full"  :src="message.avatorImg"/>
        </div>
            <div class="flex  justify-between items-center flex-1">
                <div class="font-bold text-gray-700">{{message.username}}</div>
                <div class="text-sm text-neutral-400">{{formatTime(message.createtime)}}</div>
            </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter()
const currentUserNo = Number(localStorage.getItem('userNo'))
const props = defineProps({
    message: {
        type: Object as PropType<{  name: string , time: string,avatar:string ,content:string}>,
        required: true
    }
})
const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleString();
}
const jumpPage = (sessionNo: string,talkNo: string,userNo:string) => {
    if(talkNo != currentUserNo){
        router.push(`/messageChat/${sessionNo}/${talkNo}`)
    }
    else{
        router.push(`/messageChat/${sessionNo}/${userNo}`)
    }
   
}
</script>

<style scoped lang="scss">
.my-width{
    width: calc(100% - 60px);
}
</style>