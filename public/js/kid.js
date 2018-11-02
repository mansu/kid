$(function() {
        var level_prefix  = "#level";
        var curr_level = 2;
        var node_level_map = {};

        init();

        function init() {
          createMainLevel();

          //enable tooltips
          $(".nodelink[title]", "#node0").tipTip();
          $(".nodeinfo[title]", "#node0").tipTip();

          //On clicking a node link, show more info about that nodeLink
          //Make nodelinks clickable
          $( ".nodelink" ).live('click', addNode); 

          $('a').live('click', function() {
                window.open($(this).attr('href'));
                    return false;
          });

          // Close node links when clicked.
          $(".closeBtn").live('click', function() {
              console.log("hiding div" + $(this).closest(".node"));
              $(this).closest(".node").hide();
          });
        }

        //Create the first level
        function createMainLevel() {
          // Add node0
          var node = $("#node0.hiddennode").clone().removeClass("hiddennode").addClass("node");
          node.corner("6px");
          node.data('level', curr_level);
          getLevel(curr_level).prepend(node);

          console.log("added node0");
        }

        function getLevel(level) {
          //return $("layoutTable").find(level_prefix + level);
          return $(level_prefix + level);
        }

        function addNode(ev) {
          var activeNode = $(this);

          // If adding an lnode, open it in curr_level + 2.
          // If opening a regular node:
          //  - If opened from lnode, add it in lnode_lvl + 1
          //  - If opened from reg node, add it in node_level.
          var hiddenNode = activeNode.data("rel");
          if(hiddenNode.substr(0,5) == "lnode") {
            // Add lnode if it's not already added.
            if($("#"+hiddenNode.substr(1)+".node").length == 0) {
              curr_level = curr_level + 2;
              $(level_prefix + curr_level).css("position", "float");
              addNodeAtLevel(hiddenNode.substr(1), curr_level, "level")
            }
            // TODO: else Highlight  and scroll to that lnode
          } else { //adding normal node
            var invoking_node_level = getParentNode(activeNode).data('level');
            // lnodes are at even levels and lnodes are lonely beings 
            if(invoking_node_level%2 == 0) {
              invoking_node_level = invoking_node_level + 1;
            }

            // Add a normal node if it doesn't exist in this level
            // This also allows us to view the same node in multiple levels.
            if($("#"+hiddenNode+".node").length == 0) {
              addNodeAtLevel(hiddenNode, invoking_node_level, "regular");
            } else if(parseInt($("#"+hiddenNode).data('level')) - invoking_node_level != 0) {
              // add a regular node in the same level if missing.
              addNodeAtLevel(hiddenNode, invoking_node_level, "regular");
            } else {
              //highlight the existing node 
              $("#"+hiddenNode+".node").effect("highlight", {} , 500);
            }
          }
        }

        // Given a node find the dom element of class node
        function getParentNode(activeNode) {
          var parentNode = activeNode;
          // TODO: Remove infinite loop check.
          var i = 0;
          while(parentNode.attr('id').search("node") < 0) {
            parentNode = parentNode.parent();
            console.log("parentNode: " + parentNode.attr('id'));
            // Stop infinite loops from killing the browser
            i++;
            if(i>10) {
              console.log("infinite loop broken " + parentNode.attr('id'));
              break;
            }
          }
          console.log("Parent node is:" + parentNode);
          return parentNode;
        }
        
        function closeDiv(event) {
          //get div
          console.log($(this).parent(".node"))
          $(this).parent(".node").hide();
        }

        function addNodeAtLevel(hiddenNodeName, level, layoutType) {
          var node = $("#"+hiddenNodeName).clone().removeClass("hiddennode").addClass("node");

          //title bar
          if(node.data('title') != undefined && node.data('title') !== '') {
            node.prepend("<p class=nodeTitleBar> <span class=closeBtn title='hide this node'> X </span>" + node.data('title') + "</p>")
          }

          getLevel(level).prepend(node);

          //store the level in node so we can use it in when adding child nodes.
          node.data('level', level);

          node.corner("6px"); // rounded corners

          // node is draggable and resizable
          node.draggable({
            handle : "p.nodeTitleBar",
          });
          node.resizable();

          // manual layout
          if(layoutType == "regular") {
            node.css("width","350");
            node.css("height","400");
            node.css("float","left");
          }
          console.log("added " + hiddenNodeName + " at " + level);

          //enable tooltips for this node
          $(".nodelink[title]", "#"+hiddenNodeName).tipTip();
          $(".nodeinfo[title]", "#"+hiddenNodeName).tipTip();
        }

/*
        function layout() {
            // set the max size of level 1 to be 2/3 size of the remaining screen.
            // for a mac pro screen, only have 2 nodes side by side, for hd have 3 nodes
            console.log($("#level0").position());
            console.log($("#level0").height());
            console.log($("#level0").width());
            console.log(screen.width);

            var prev_level_str = $level_prefix + prev_level;
            var curr_level_str = $level_prefix + curr_level;

            $(curr_level_str).css("maxHeight", .45 * (screen.height - $(prev_level_str).height()));
        } 
        */

        //TODO: Add a close icon for each div.
        //TODO: Use a smarter layout algo for the divs.
        //TODO: Get level automatically. Add level automatically.
        //TODO: Add a nice scroll bar.
        //TODO: Using droppable and draggable, swap 2 node positions.
        //TODO: Standardize sections in kid.
        //TODO: Clear separation between command and output.
        //TODO: Add table layout where required.
        //TODO: Make tables explicit.
        //TODO: Add HTML in tool tips. Make tooltips scale with text. Make tooltips look good.
        
        //TODO: Implement closing nodes.
        //TODO: Add levels dynamically 
        //TODO: Color related nodes?
        //TODO: Make all JS and css local, so that kid pages can be distributed locally.
});
