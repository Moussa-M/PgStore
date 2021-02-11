<template>
<div>
    <div :class="removeable ? 'removeable':''" @click.prevent="selectImage" class="avatar" :style="style">
        <div style="position:relative;z-index:999998">
            <div v-if="img!=null" @click="removeImage($event)" id="close"></div>
        </div>
        <div id="container">
            <span v-if="!hasImage()">{{initials}}</span>
            <canvas v-if="hasImage()" ref="previewCanvas" class="picture-preview"></canvas>
        </div>
    </div>
    <input ref="fileInput" type="file" accept="image/jpeg, image/png" @change="onFileChange($event)">
</div>
</template>

<script>
const fs = require("fs-extra");
const path = require("path");
export default {
    name: "Avatar",
    data() {
        return {
            img: ""
        };
    },

    activated() {
        this.img = this.image;
        if (this.hasImage()) {
            this.loadImage(this.img, false);
        }
    },
    created() {
        this.img = this.image;
        if (this.hasImage()) {
            this.loadImage(this.img, false);
        }
    },
    props: {
        fullname: {
            type: String,
            default: "##"
        },
        width: {
            type: [String, Number],
            default: 50
        },
        height: {
            type: [String, Number],
            default: 50
        },
        radius: {
            type: Number,
            default: 5,
            validator: value => value >= 0 && value <= 50
        },
        color: {
            type: String,
            default: "#3F3F3F"
        },
        crop: {
            type: Boolean,
            default: false
        },
        usefallname: {
            type: Boolean,
            default: false
        },
        changeable: {
            type: Boolean,
            default: true
        },
        removeable: {
            type: Boolean,
            default: false
        },
        showPointer: {
            type: Boolean,
            default: false
        },

        image: {
            type: String,
            default: ""
        }
    },

    computed: {
        initials() {
            var words = this.fullname.split(/[\s-]+/);
            var intls = "";
            for (var i = 0; i < words.length; i++) {
                intls += words[i].substr(0, 1).toUpperCase();
            }
            if (intls.length > 3) {
                intls = intls.substr(0, 3);
            }
            if (this.usefallname) {
                return this.fullname;
            } else {
                return intls;

            }
        },

        style() {
            var fontSize = this.width / 3 + "px";
            if (this.usefallname) {
                var fontSize = "1.4vw";
            }

            let style = {
                width: this.width + "px",
                height: this.height + "px",
                "border-radius": this.radius + "%",
                "font-size": fontSize,
                "text-align": "center",
                "cursor": this.showPointer ? "pointer" : this.changeable ? "pointer" : "default",
                "background-color": this.color === "#3F3F3F" ? this.toColor(this.fullname) : this.color
            };
            if (this.hasImage()) {
                delete style["background-color"]
            }
            return style;
        },

    },

    watch: {
        image() {
            this.img = this.image;
            if (this.hasImage()) {
                this.loadImage(this.image, false);
            }
        }
    },

    methods: {
        hasImage() {
            if (this.img !== "" && this.img !== null) {
                return true;
            } else {
                return false;
            }
        },
        removeImage(e) {
            e.stopPropagation();
            const canvas = this.$refs.previewCanvas;
            if (canvas) {
                let context = canvas.getContext("2d");
                context.clearRect(0, 0, canvas.width, canvas.height);
                this.img = null;
                this.$emit("removed");
            }

        },
        loadImage(impath, emiturl) {
            let canvasWidth = this.width;
            let canvasHeight = this.height;
            let imageObject = new Image();
            // let imageObject = document.createElement("img");

            //  imageObject.addEventListener('load', ()=>{
            //    console.log("getin");
            //    this.drawImage(imageObject, emiturl);
            //  }, false);
            imageObject.onload = () => {
                this.drawImage(imageObject, emiturl);
            };

            // imageObject.onerror = function(err) {
            //   console.error(err);

            // };

            // if (impath.indexOf('static') == 0) {
            imageObject.src = impath;
            // } else {
            //   const nativeImage = require('electron').nativeImage
            //   let datauri = nativeImage.createFromPath(impath).toDataURL()
            //   imageObject.src = datauri
            // }
        },

        drawImage(image, emiturl) {
            let pixelRatio = Math.round(
                window.devicePixelRatio ||
                window.screen.deviceXDPI / window.screen.logicalXDPI
            );

            let imageRatio = image.width / image.height;
            let offsetX = 0;
            let offsetY = 0;
            let X = this.width;
            let Y = this.height;
            const canvasRatio = this.width / this.height;

            if (this.crop) {
                if (imageRatio >= canvasRatio) {
                    X = this.height * imageRatio;
                    offsetX = (this.width - X) / 2;
                } else {
                    Y = X / imageRatio;
                    offsetY = (this.height - Y) / 2;
                }
            } else {
                if (imageRatio >= canvasRatio) {
                    Y = X / imageRatio;
                    offsetY = (this.height - Y) / 2;
                } else {
                    X = Y * imageRatio;
                    offsetX = (this.width - X) / 2;
                }
            }

            const canvas = this.$refs.previewCanvas;
            if (canvas) {
                let context = canvas.getContext("2d");
                context.scale(pixelRatio, pixelRatio);
                canvas.style.background = "none";
                canvas.width = this.width * pixelRatio;
                canvas.height = this.height * pixelRatio;
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, canvas.width, canvas.height);

                context.drawImage(
                    image,
                    offsetX * pixelRatio,
                    offsetY * pixelRatio,
                    X * pixelRatio,
                    Y * pixelRatio
                );
                // console.log("before if emit");
                if (emiturl) {
                    // console.log("emited");
                    this.$emit("dataURL", canvas.toDataURL());
                }
            }

        },

        selectImage() {
            if (this.changeable) {
                // alert("asssi hot ")
                this.$refs.fileInput.click();
            }
        },
        onFileChange(e) {
            // console.log("changed iiiii");
            // console.log(e.target.files[0].path);
            this.img = e.target.files[0].path;
            this.loadImage(this.img, true);
            this.$emit("change", this.img);
        },
        toColor(str) {
            var hash = 0;
            var len = str.length;
            if (len === 0) return "black";
            for (var i = 0; i < len; i++) {
                hash = (hash << 8) - hash + str.charCodeAt(i);
                hash |= 0;
            }
            hash = Math.abs(hash);

            let color = hash.toString(16).substr(0, 6);
            if (color.length < 6) {
                color =
                    color +
                    Array.apply(null, {
                        length: 6 - color.length
                    })
                    .fill(0)
                    .join("");
            }

            return "#" + color;
        }
    }
};
</script>

<style scoped>
.avatar {
    display: inline-block;
    background-color: transparent;
    color: white;
    overflow: hidden;
    width: 50px;
    height: 50px;
    font-size: 12px;
    font-style: normal;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: none;
}

.avatar #container {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

input[type="file"] {
    display: none;
}

.picture-preview {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 8;
    /* z-index: 10000; */
    box-sizing: border-box;

    background-color: #230000a8;
}

#close {
    display: none;
    position: absolute;
    cursor: pointer;
    top: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
    background-image: url("data:image/png;base64,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");
    color: rgb(202, 83, 83);
}

.removeable:hover #close {
    display: block;
}
</style>
