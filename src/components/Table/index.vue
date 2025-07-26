<template>
  <div>
    <el-table
      ref="table"
      :data="tableList"
      :max-height="maxHeight"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @select=tableSelect
      @row-click="clickRow"
    >
      <template v-for="(item, index) in propList">
        <el-table-column
          v-if="item.type == 'selection'"
          :key="index"
          type="selection"
          :width="item.width ? item.width : 60"
          :align="item.align ? item.align : 'center'"
        >
        </el-table-column>
        <el-table-column
          v-if="item.type == 'expand'"
          :key="index"
          type="expand"
          :width="item.width"
          :align="item.align ? item.align : 'center'"
        >
          <template slot-scope="scope">
            <ex-slot
              :render="item.render"
              :row="scope.row"
              :index="scope.$index"
              :column="item"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="!item.type"
          :key="index"
          :width="item.width"
          :prop="item.prop"
          :label="item.label"
          :show-overflow-tooltip="item.tooltip"
          :align="item.align"
          :fixed="item.fixed"
          :formatter="item.formatter"
        >
          <template slot-scope="scope">
            <!--正常渲染-->
            <template v-if="!item.render">
              <template v-if="item.formatter">
                <span v-html="item.formatter(scope.row, item)" />
              </template>
              <template v-else>
                <span>{{ scope.row[item.prop] }}</span>
              </template>
            </template>
            <!--render函数-->
            <template v-else>
              <ex-slot
                :render="item.render"
                :row="scope.row"
                :index="scope.$index"
                :column="item"
              />
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>
<script>
const exSlot = {
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null,
    },
  },
  render: (h, data) => {
    const params = {
      row: data.props.row,
      index: data.props.index,
    };
    if (data.props.column) params.column = data.props.column;
    return data.props.render(h, params);
  },
};
export default {
  components: {
    exSlot,
  },

  props: {
    propList: {
      type: Array,
      default: () => [],
    },
    tableList: {
      type: Array,
      default: () => [],
    },
    maxHeight: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      multipleSelection: null,
    };
  },
  methods: {
    tableSelect(rows, row) {
        　　let selected = rows.length && rows.indexOf(row) !== -1
        this.$emit('tableSelect', selected, row)
        // 　　console.log(selected)  // true就是选中，0或者false是取消选中
       },
    handleSelectionChange(val) {
      // 多行选中
      this.multipleSelection = val;
      this.$emit("handleSelectionChange", val);
    },
    /**
     * 单击行事件
     * */
    clickRow(row, column, event) {
      let data = {
        row: row,
        column: column,
        event: event,
      };
      this.$emit("clickRow", data);
    },
  },
};
</script>
