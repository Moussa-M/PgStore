<template>
     <div class="main-panel">
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle">
                        <span class="sr-only">{{ $t("toggle_nav") }}</span>
                        <span class="icon-bar bar1"></span>
                        <span class="icon-bar bar2"></span>
                        <span class="icon-bar bar3"></span>
                    </button>
                    <a class="navbar-brand" >{{$t("order_details")}}</a>
                </div>
           
            </div>
        </nav>
        <div class="content">
            <div class="container-fluid">
            
            </div>
        </div>
    </div>
</template>


<script>
export default {
  name: 'OrderDetails'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >

</style>
