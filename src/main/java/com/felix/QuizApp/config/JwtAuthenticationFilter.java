package com.felix.QuizApp.config;

import com.felix.QuizApp.exceptions.InvalidJwtAuthenticationException;
import com.felix.QuizApp.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.CachingUserDetailsService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // bypass swagger :
        String path =request.getRequestURI();
        if(path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs")  || path.startsWith("/v3/")|| path.equals("/swagger-ui.html")){
            filterChain.doFilter(request,response);
            return;
        }




        // Extract JWT token from Authorization header
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

      try{
          if (authHeader != null && authHeader.startsWith("Bearer ")) {
              token = authHeader.substring(7); // Remove "Bearer " prefix
              try {
                  username = jwtUtil.extractUsername(token);
              } catch (Exception e) {
                  logger.error("Invalid JWT Token: " + e.getMessage());
                  throw new InvalidJwtAuthenticationException("Invalid JWT Token: "+e.getMessage());

              }
          }

          // If token is valid and user is not yet authenticated
          if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
              UserDetails userDetails = userDetailsService.loadUserByUsername(username);

              if (jwtUtil.validateToken(token, userDetails)) {
                  UsernamePasswordAuthenticationToken authentication =
                          new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                  authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                  SecurityContextHolder.getContext().setAuthentication(authentication);
              }
          }

          filterChain.doFilter(request, response);
      }catch(Exception e){
          sendErrorResponse(response, e.getMessage());
      }
    }
    // ✅ Send custom error response as JSON
    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Unauthorized");
        errorResponse.put("message", message);

        response.getWriter().write(new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(errorResponse));
    }
}


