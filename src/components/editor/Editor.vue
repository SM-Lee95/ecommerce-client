<template>
  <v-container fluid class="editor">
    <editor-menu-bar
      v-if="swMenubar"
      :editor="editor"
      v-slot="{ commands, isActive }"
    >
      <v-row class="menubar">
        <v-col>
          <v-btn
            icon
            class="menubar__button"
            :class="{ 'is-active': isActive.bold() }"
            @click.prevent="commands.bold"
          >
            <v-icon>mdi-format-bold</v-icon>
          </v-btn>
          <v-btn
            icon
            class="menubar__button"
            :class="{ 'is-active': isActive.italic() }"
            @click.prevent="commands.italic"
          >
            <v-icon>mdi-format-italic</v-icon>
          </v-btn>
          <v-btn
            icon
            class="menubar__button"
            :class="{ 'is-active': isActive.strike() }"
            @click.prevent="commands.strike"
          >
            <v-icon>mdi-format-strikethrough</v-icon>
          </v-btn>
          <v-btn
            icon
            class="menubar__button"
            :class="{ 'is-active': isActive.underline() }"
            @click.prevent="commands.underline"
          >
            <v-icon>mdi-format-underline</v-icon>
          </v-btn>
          <v-btn
            icon
            class="menubar__button"
            :class="{ 'is-active': isActive.code() }"
            @click.prevent="commands.code"
          >
            <v-icon>mdi-xml</v-icon>
          </v-btn>
          <v-btn
            icon
            class="menubar__button"
            :class="{ 'is-active': isActive.paragraph() }"
            @click.prevent="commands.paragraph"
          >
            <v-icon>mdi-format-paragraph</v-icon>
          </v-btn>

          <v-btn
            icon
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            @click.prevent="commands.heading({ level: 1 })"
          >
            H1
          </v-btn>

          <v-btn
            icon
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            @click.prevent="commands.heading({ level: 2 })"
          >
            H2
          </v-btn>

          <v-btn
            icon
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 3 }) }"
            @click.prevent="commands.heading({ level: 3 })"
          >
            H3
          </v-btn>
          <v-btn
            icon
            class="menubar__button"
            :class="{ 'is-active': isActive.bullet_list() }"
            @click.prevent="commands.bullet_list"
          >
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
          <v-btn
            icon
            class="menubar__button"
            :class="{ 'is-active': isActive.ordered_list() }"
            @click.prevent="commands.ordered_list"
          >
            <v-icon>mdi-format-list-numbered</v-icon>
          </v-btn>
          <v-btn
            icon
            class="menubar__button"
            :class="{ 'is-active': isActive.blockquote() }"
            @click.prevent="commands.blockquote"
          >
            <v-icon>mdi-format-quote-open</v-icon>
          </v-btn>
          <v-btn icon class="menubar__button" @click.prevent="commands.undo">
            <v-icon>mdi-undo</v-icon>
          </v-btn>
          <v-btn icon class="menubar__button" @click.prevent="commands.redo">
            <v-icon>mdi-redo</v-icon>
          </v-btn>
          <v-btn
            icon
            class="menubar__button"
            :class="{ 'is-active': isActive.image() }"
          >
            <v-icon>mdi-image</v-icon>
          </v-btn>
          <v-btn text @click="save()"> save </v-btn>
        </v-col>
      </v-row>
    </editor-menu-bar>
    <editor-content class="editor__content mt-2" :editor="editor" />
    <v-row style="max-width: 80%">
      <v-col v-html="this.look"></v-col>
    </v-row>
  </v-container>
</template>


<script>
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Image,
} from "tiptap-extensions";
import { mapGetters } from "vuex";

export default {
  components: {
    EditorContent,
    EditorMenuBar,
  },
  data() {
    return {
      swMenubar: true,
      linkMenuIsActive: true,
      editor: new Editor({
        editable: true,
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new Link({
            rel: "",
            target: "_blank",
          }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Image(),
        ],
        content: "",
        onUpdate: function (editor) {
          let html = editor.getHTML();
          if (html.includes('<img src="data:image')) {
            //변경 안된 이미지 파일 존재여부
            let subStr = html.substring(
              html.indexOf('<img src="data:image') + 10
            ); //data:image 부터 base64 encoding된 부분까지 가져오기
            subStr = subStr.substring(0, subStr.indexOf('">'));
            let file = this.dataURLtoFile(
              subStr,
              new Date().YYYYMMDDHHMMSS() +
                "." +
                subStr.substring(
                  subStr.indexOf("data:image") + 11,
                  subStr.indexOf("base64") - 1
                )
            );
            this.fileTransfer(
              file,
              html.replace(
                '<img src="data:image',
                '<img class="" src="data:image'
              ),
              subStr
            );
          }
        },
      }),
      look: "",
    };
  },
  computed: {
    ...mapGetters("common", ["EditorHTML"]),
  },
  mounted() {
    this.editor.fileTransfer = (file, html, subStr) => {
      const formData = new FormData();
      formData.append("image", file);
      this.$store.dispatch("insertPrdImg", formData).then((resp) => {
        this.editor.setContent(html.replace(subStr, resp));
      });
    };
    this.editor.dataURLtoFile = function (dataurl, fileName) {
      var arr = dataurl.split(",");
      var mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      return new File([u8arr], fileName, { type: mime });
    };
    this.$store.commit("common/setEditorHTML", "");
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  methods: {
    save: function () {
      this.$store.commit("common/setEditorHTML", this.editor.getHTML());
      this.$dialog.message.info("저장완료");
      this.editor.destroy();
      this.look = this.EditorHTML;
    },
  },
};
</script>

<style lang="scss">
.editor {
  position: relative;
  margin: 0 auto 5rem auto;

  .menubar {
    text-align: center;
    border-bottom: 1px solid #ddd;
    padding: 0.2rem 0;
    transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;

    &.is-hidden {
      visibility: hidden;
      opacity: 0;
    }

    &.is-focused {
      visibility: visible;
      opacity: 1;
      transition: visibility 0.2s, opacity 0.2s;
    }

    &__button {
      font-weight: bold;
      display: inline-flex;
      background: transparent;
      border: 0;
      color: black;
      padding: 0.2rem 0.5rem;
      margin-right: 0.2rem;
      border-radius: 3px;
      cursor: pointer;

      &:hover {
        background-color: rgba(black, 0.05);
      }

      &.is-active {
        background-color: rgba(black, 0.1);
      }
    }

    span#{&}__button {
      font-size: 13.3333px;
    }
  }

  .editor__content {
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;

    .ProseMirror {
      min-height: 10rem;
      padding: 0.5rem;

      &:focus {
        outline: none;
      }

      pre {
        padding: 0.7rem 1rem;
        border-radius: 5px;
        background: black;
        color: white;
        font-size: 0.8rem;
        overflow-x: auto;

        code {
          display: block;
        }
      }

      p code {
        padding: 0.2rem 0.4rem;
        border-radius: 5px;
        font-size: 0.8rem;
        font-weight: bold;
        background: rgba(black, 0.1);
        color: rgba(black, 0.8);
      }

      ul,
      ol {
        padding-left: 1rem;
      }

      li > p,
      li > ol,
      li > ul {
        margin: 0;
      }

      a:not(.btn) {
        color: grey;
        text-decoration: underline;
      }

      blockquote {
        border-left: 3px solid rgba(black, 0.1);
        color: rgba(black, 0.8);
        padding-left: 0.8rem;
        font-style: italic;

        p {
          margin: 0;
        }
      }

      img {
        max-width: 100%;
        border-radius: 3px;
      }

      table {
        border-collapse: collapse;
        table-layout: fixed;
        width: 100%;
        margin: 0;
        overflow: hidden;

        td,
        th {
          min-width: 1em;
          border: 2px solid gray;
          padding: 3px 5px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;

          > * {
            margin-bottom: 0;
          }
        }

        th {
          font-weight: bold;
          text-align: left;
        }

        .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: rgba(200, 200, 255, 0.4);
          pointer-events: none;
        }

        .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: 0;
          width: 4px;
          z-index: 20;
          background-color: #adf;
          pointer-events: none;
        }
      }

      .tableWrapper {
        margin: 1em 0;
        overflow-x: auto;
      }

      .resize-cursor {
        cursor: ew-resize;
        cursor: col-resize;
      }
    }
  }
}
</style>