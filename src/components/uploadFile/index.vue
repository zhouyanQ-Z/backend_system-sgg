<template>
  <el-upload
    class="avatar-uploader"
    :action="upload"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><UploadFilled /></el-icon>
  </el-upload>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import type { UploadProps } from "element-plus";
  import { msgError } from "@/utils/modal";

  let props = defineProps(["imageUrl"]);
  let emits = defineEmits(['uploadUrl']);

  let upload = ref<string>('/api/admin/product/fileUpload')

  // 图片上传之前触发的钩子函数
  const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
    if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png" && rawFile.type !== "image/gif") {
      msgError("上传格式必须是PNG|JPG|GIF");
      return false;
    } else if (rawFile.size / 1024 / 1024 > 4) {
      msgError("上传文件大小不超过4MB");
      return false;
    }
    return true;
  };

  // 图片上传成功
  const handleAvatarSuccess: UploadProps["onSuccess"] = (
    response,
    uploadFile
  ) => {    
    //props.imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    emits('uploadUrl',response.data)
  };
</script>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  /*color: #8c939d;*/
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
